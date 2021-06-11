import JSBI from "jsbi";
import keyBy from "lodash.keyby";
import { TickMath, tickToPrice, Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { Price, CurrencyAmount } from "@uniswap/sdk-core";
import { BigNumber } from "@ethersproject/bignumber";
const PRICE_FIXED_DIGITS = 4;
const DEFAULT_SURROUNDING_TICKS = 300;
const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);
const FEE_TIER_TO_TICK_SPACING = (feeTier: string): number => {
  switch (feeTier) {
    case "10000":
      return 200;
    case "3000":
      return 60;
    case "500":
      return 10;
    default:
      throw Error(`Tick spacing for fee tier ${feeTier} undefined.`);
  }
};

let playground = "http://120.92.137.203:9002/subgraphs/name/multiple/v3";

const fetchData = (query: string) => {
  return fetch(playground, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
};

const fetchInitializedTicks = function (low: number, upper: number) {
  const query = `
        query {
          ticks(first: 1000, skip: 0, where: {poolAddress: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e", tickIdx_lte: ${upper}, tickIdx_gte: ${low}}) {
            tickIdx
            liquidityGross
            liquidityNet
            price0
            price1
          }
        }
        `;
  return fetchData(query);
};

const fetchPools = function () {
  const query = `
         query {
            pool(id: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e") {
            tick
            token0 {
                symbol
                id
                decimals
            }
            token1 {
                symbol
                id
                decimals
            }
            feeTier
            sqrtPrice
            liquidity
            }

         }
  `;
  return fetchData(query);
};

interface TickPool {
  tick: string;
  feeTier: string;
  token0: {
    symbol: string;
    id: string;
    decimals: string;
  };
  token1: {
    symbol: string;
    id: string;
    decimals: string;
  };
  sqrtPrice: string;
  liquidity: string;
}

interface PoolResult {
  pool: TickPool;
}

// Raw tick returned from GQL
interface Tick {
  tickIdx: string;
  liquidityGross: string;
  liquidityNet: string;
  price0: string;
  price1: string;
}

interface SurroundingTicksResult {
  ticks: Tick[];
}

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  liquidityGross: JSBI;
  liquidityNet: JSBI;
  tickIdx: number;
  liquidityActive: JSBI;
  price0: string;
  price1: string;
}

export interface PoolTickData {
  ticksProcessed: TickProcessed[];
  feeTier: string;
  tickSpacing: number;
  activeTickIdx: number;
}

export const fetchTicksSurroundingPrice = async (
  numSurroundingTicks = DEFAULT_SURROUNDING_TICKS
): Promise<{
  data?: PoolTickData;
}> => {
  let result1 = await fetchPools();
  const { data: poolResult } = result1;

  const {
    pool: {
      tick: poolCurrentTick,
      feeTier,
      liquidity,
      token0: { id: token0Address, decimals: token0Decimals },
      token1: { id: token1Address, decimals: token1Decimals },
    },
  } = poolResult;

  const poolCurrentTickIdx = parseInt(poolCurrentTick);
  const tickSpacing = FEE_TIER_TO_TICK_SPACING(feeTier);

  // The pools current tick isn't necessarily a tick that can actually be initialized.
  // Find the nearest valid tick given the tick spacing.
  const activeTickIdx =
    Math.floor(poolCurrentTickIdx / tickSpacing) * tickSpacing;

  // Our search bounds must take into account fee spacing. i.e. for fee tier 1%, only
  // ticks with index 200, 400, 600, etc can be active.
  const tickIdxLowerBound = activeTickIdx - numSurroundingTicks * tickSpacing;
  const tickIdxUpperBound = activeTickIdx + numSurroundingTicks * tickSpacing;

  const initializedTicksResult = await fetchInitializedTicks(tickIdxLowerBound, tickIdxUpperBound);
  // console.log('--------initializedTicksResult----',initializedTicksResult)
  const { ticks: initializedTicks } = initializedTicksResult.data;

  const tickIdxToInitializedTick = keyBy(initializedTicks, "tickIdx");

  const token0 = new Token(1, token0Address, parseInt(token0Decimals));
  const token1 = new Token(1, token1Address, parseInt(token1Decimals));

  // console.log({ activeTickIdx, poolCurrentTickIdx }, "Active ticks");

  // If the pool's tick is MIN_TICK (-887272), then when we find the closest
  // initializable tick to its left, the value would be smaller than MIN_TICK.
  // In this case we must ensure that the prices shown never go below/above.
  // what actual possible from the protocol.
  let activeTickIdxForPrice = activeTickIdx;
  if (activeTickIdxForPrice < TickMath.MIN_TICK) {
    activeTickIdxForPrice = TickMath.MIN_TICK;
  }
  if (activeTickIdxForPrice > TickMath.MAX_TICK) {
    activeTickIdxForPrice = TickMath.MAX_TICK;
  }

  const activeTickProcessed: TickProcessed = {
    liquidityActive: JSBI.BigInt(liquidity),
    tickIdx: activeTickIdx,
    liquidityNet: JSBI.BigInt(0),
    price0: tickToPrice(token0, token1, activeTickIdxForPrice).toFixed(
      PRICE_FIXED_DIGITS
    ),
    price1: tickToPrice(token1, token0, activeTickIdxForPrice).toFixed(
      PRICE_FIXED_DIGITS
    ),
    liquidityGross: JSBI.BigInt(0),
  };

  // If our active tick happens to be initialized (i.e. there is a position that starts or
  // ends at that tick), ensure we set the gross and net.
  // correctly.
  const activeTick = tickIdxToInitializedTick[activeTickIdx];
  if (activeTick) {
    activeTickProcessed.liquidityGross = JSBI.BigInt(activeTick.liquidityGross);
    activeTickProcessed.liquidityNet = JSBI.BigInt(activeTick.liquidityNet);
  }

  enum Direction {
    ASC,
    DESC,
  }

  // Computes the numSurroundingTicks above or below the active tick.
  const computeSurroundingTicks = (
    activeTickProcessed: TickProcessed,
    tickSpacing: number,
    numSurroundingTicks: number,
    direction: Direction
  ) => {
    let previousTickProcessed: TickProcessed = {
      ...activeTickProcessed,
    };

    // Iterate outwards (either up or down depending on 'Direction') from the active tick,
    // building active liquidity for every tick.
    let processedTicks: TickProcessed[] = [];
    for (let i = 0; i < numSurroundingTicks; i++) {
      const currentTickIdx =
        direction == Direction.ASC
          ? previousTickProcessed.tickIdx + tickSpacing
          : previousTickProcessed.tickIdx - tickSpacing;

      if (
        currentTickIdx < TickMath.MIN_TICK ||
        currentTickIdx > TickMath.MAX_TICK
      ) {
        break;
      }

      const currentTickProcessed: TickProcessed = {
        liquidityActive: previousTickProcessed.liquidityActive,
        tickIdx: currentTickIdx,
        liquidityNet: JSBI.BigInt(0),
        price0: tickToPrice(token0, token1, currentTickIdx).toFixed(
          PRICE_FIXED_DIGITS
        ),
        price1: tickToPrice(token1, token0, currentTickIdx).toFixed(
          PRICE_FIXED_DIGITS
        ),
        liquidityGross: JSBI.BigInt(0),
      };

      // Check if there is an initialized tick at our current tick.
      // If so copy the gross and net liquidity from the initialized tick.
      const currentInitializedTick =
        tickIdxToInitializedTick[currentTickIdx.toString()];
      if (currentInitializedTick) {
        currentTickProcessed.liquidityGross = JSBI.BigInt(
          currentInitializedTick.liquidityGross
        );
        currentTickProcessed.liquidityNet = JSBI.BigInt(
          currentInitializedTick.liquidityNet
        );
      }

      // Update the active liquidity.
      // If we are iterating ascending and we found an initialized tick we immediately apply
      // it to the current processed tick we are building.
      // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
      if (direction == Direction.ASC && currentInitializedTick) {
        currentTickProcessed.liquidityActive = JSBI.add(
          previousTickProcessed.liquidityActive,
          JSBI.BigInt(currentInitializedTick.liquidityNet)
        );
      } else if (
        direction == Direction.DESC &&
        JSBI.notEqual(previousTickProcessed.liquidityNet, JSBI.BigInt(0))
      ) {
        // We are iterating descending, so look at the previous tick and apply any net liquidity.
        currentTickProcessed.liquidityActive = JSBI.subtract(
          previousTickProcessed.liquidityActive,
          previousTickProcessed.liquidityNet
        );
      }

      processedTicks.push(currentTickProcessed);
      previousTickProcessed = currentTickProcessed;
    }

    if (direction == Direction.DESC) {
      processedTicks = processedTicks.reverse();
    }

    return processedTicks;
  };

  const subsequentTicks: TickProcessed[] = computeSurroundingTicks(
    activeTickProcessed,
    tickSpacing,
    numSurroundingTicks,
    Direction.ASC
  );

  const previousTicks: TickProcessed[] = computeSurroundingTicks(
    activeTickProcessed,
    tickSpacing,
    numSurroundingTicks,
    Direction.DESC
  );

  const ticksProcessed = previousTicks
    .concat(activeTickProcessed)
    .concat(subsequentTicks);

  return {
    data: {
      ticksProcessed,
      feeTier,
      tickSpacing,
      activeTickIdx,
    },
  };
};

export const getV3LP = () => fetchTicksSurroundingPrice()
  .then((res) => {
    return formatData(res.data);
  })

const token0 = new Token(1, "0x751290426902f507a9c0c536994b0f3997855BA0", 6);
const token1 = new Token(1, "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a", 18);
async function formatData(poolTickData: any) {
  const newData: { tvlToken0: number; tvlToken1: number }[] = await Promise.all(
    poolTickData.ticksProcessed.map(async (t: TickProcessed, i: number) => {
      const active = t.tickIdx === poolTickData.activeTickIdx;
      const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(t.tickIdx);
      const feeAmount = 3000;
      const mockTicks = [
        {
          index: t.tickIdx - 60,
          liquidityGross: t.liquidityGross,
          liquidityNet: JSBI.multiply(t.liquidityNet, JSBI.BigInt("-1")),
        },
        {
          index: t.tickIdx,
          liquidityGross: t.liquidityGross,
          liquidityNet: t.liquidityNet,
        },
      ];
      const pool = new Pool(
        token0,
        token1,
        3000,
        sqrtPriceX96,
        t.liquidityActive,
        t.tickIdx,
        mockTicks
      );
      const nextSqrtX96 = poolTickData.ticksProcessed[i - 1]
        ? TickMath.getSqrtRatioAtTick(
          poolTickData.ticksProcessed[i - 1].tickIdx
        )
        : undefined;
      const maxAmountToken0 = token0
        ? CurrencyAmount.fromRawAmount(token0, MAX_UINT128.toString())
        : undefined;
      const outputRes0 =
        pool && maxAmountToken0
          ? await pool.getOutputAmount(maxAmountToken0, nextSqrtX96)
          : undefined;

      const token1Amount = outputRes0?.[0] as CurrencyAmount<Token> | undefined;

      const amount0 = token1Amount
        ? parseFloat(token1Amount.toExact()) * parseFloat(t.price1)
        : 0;
      const amount1 = token1Amount ? parseFloat(token1Amount.toExact()) : 0;

      return {
        index: i,
        isCurrent: active,
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
        price1: parseFloat(t.price1),
        tvlToken0: amount0,
        tvlToken1: amount1,
      };
    })
  );
  // offset the values to line off bars with TVL used to swap across bar
  newData?.map((entry, i: number) => {
    if (i > 0) {
      newData[i - 1].tvlToken0 = entry.tvlToken0;
      newData[i - 1].tvlToken1 = entry.tvlToken1;
    }
  });
  return newData;
}
