import { getTokenSymbol, collect } from "./index";
import { userInfo } from "./lib_const";
import { convertBigNumberToNormal } from "./lib.utils";
import { tickToPrice } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { getV3LP } from "./api2";
export function getprice(token0_address, token1_address, tick) {
    let token0 = new Token(1, token0_address, 6); //usdt
    let token1 = new Token(1, token1_address, 18); //eth
    let price0 = tickToPrice(token0, token1, tick).toFixed(4);
    let price1 = tickToPrice(token1, token0, tick).toFixed(4);
    // console.log("--------", priceToClosestTick(new Price(token0, token1, 2643.5847 * 1e6, 1e18)));
    return {
        data: {
            price0: price0,
            price1: price1,
        }
    };
}
var tokenList;
let graphql = "https://api.thegraph.com/subgraphs/name/winless/multiple";
let v3gqlurl = "http://120.92.137.203:9002/subgraphs/name/multiple/v3";
let strategyurl = "http://120.92.137.203:9002/subgraphs/name/multiple/graph-playground";
/**
 * 拿投资列表
 * @returns
 */
export async function getinvestList() {
    const query = `
      {
        positions(where:{user:"${userInfo.account}"}) {
          id
          user
          positionId
          token0
          token1
          debt0
          debt1
          exit0
          exit1
          liquidity
          tickLower
          tickUpper
          close
          }
        }
      `;
    return fetch(graphql, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
        let history = data.data.positions;
        return {
            data: history.map((item) => {
                return Object.assign(Object.assign({}, item), { debt0: convertBigNumberToNormal(item.debt0, 18), debt1: convertBigNumberToNormal(item.debt1, 18), priceLower: Math.pow(1.0001, item.tickLower), priceUpper: Math.pow(1.0001, item.tickUpper), symbol0: getTokenSymbol(item.token0), symbol1: getTokenSymbol(item.token1) });
            }),
        };
    })
        .catch(() => {
        return { data: [] };
    });
}
/**
 * 获取池子信息
 * @returns
 */
export async function getPositionInfo(poolAddress) {
    let res = await getV3LP();
    let res2 = await getPositionInfo2(poolAddress);
    return {
        data: {
            ticks: res,
            poolInfo: res2.poolInfo,
            ethPriceUSD: res2.ethPriceUSD,
        }
    };
}
/**
 * 填写pool地址
 * @param poolAddress
 * @returns
 */
export async function getPositionInfo2(poolAddress) {
    const query = `
    {
        bundles {
          ethPriceUSD
        }
        pool(id: "${poolAddress}") {
            id
            feeTier
            liquidity
            sqrtPrice
            tick
            token0 {
              id
              symbol
              name
              decimals
              derivedETH
            }
            token1 {
              id
              symbol
              name
              decimals
              derivedETH
            }
            token0Price
            token1Price
            volumeUSD
            txCount
            totalValueLockedToken0
            totalValueLockedToken1
            totalValueLockedUSD
        }
      }
      `;
    return fetch(v3gqlurl, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
        let ethPriceUSD = data.data.bundles[0].ethPriceUSD;
        let poolInfo = data.data.pool;
        return {
            poolInfo: poolInfo,
            ethPriceUSD: ethPriceUSD,
        };
    });
}
/**
 * 获取strategy
 * @returns
 */
export async function strategyEntities() {
    let res = await getPoolPrice();
    const query = `
  {
    strategyEntities(where: {user: "${userInfo.account}"}) {
      sid
      end
      pool
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
      accFee0
      accFee1
      accSwitch0
      accSwitch1
      currTickLower
      currTickUpper
      currLiquidity
    }
  }
    `;
    return fetch(strategyurl, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
        let strategyEntities = data.data.strategyEntities;
        return strategyEntities.map((item) => {
            let currPriceLower = calculatePrice(item.currTickLower);
            let currPriceUpper = calculatePrice(item.currTickUpper);
            if (currPriceLower > currPriceUpper) {
                [currPriceLower, currPriceUpper] = [currPriceUpper, currPriceLower];
            }
            let token0token1Info = calculatetoken0token1(item.currTickLower, res.tick, item.currTickUpper, item.currLiquidity, res.sqrtPrice, res.token0Price);
            return Object.assign(Object.assign(Object.assign({}, item), token0token1Info), { currPriceLower: currPriceLower, currPriceUpper: currPriceUpper, token0Price: res.token0Price, token1Price: res.token1Price, sqrtPrice: res.sqrtPrice, tick: res.tick, accumulativedee: +item.accFee0 + +item.accFee1 * +res.token0Price });
        });
    }).then(data => {
        data.sort((a, b) => { return a.sid - b.sid; });
        for (var i = 0; i < data.length; i++) {
            if (data[i].end) {
                data.splice(i, 1);
                i -= 1;
            }
        }
        const sids = data.map((item) => item.sid);
        //@ts-ignore
        sids.reduce(async (pre, sid, i) => {
            let result = await collect(sid);
            data[i]["fee0"] = result.data.fee0;
            data[i]["fee1"] = result.data.fee1;
            return 1;
        }, 1);
        return data;
    });
}
function calculatePrice(tick) {
    return 1 / Math.pow(1.0001, tick) * 1e12;
}
export function calculatetoken0token1(tickLower, tickCurrent, tickUpper, lp, sqrtPrice, token0Price) {
    let a = Math.sqrt(Math.pow(1.0001, tickLower));
    let b = sqrtPrice / Math.pow(2, 96);
    let c = Math.sqrt(Math.pow(1.0001, tickUpper));
    let token0amount = 0;
    let token1amount = 0;
    if (tickLower > tickCurrent) {
        token0amount = 0;
        token1amount = lp * (c - b) / 1e18;
    }
    else if (tickUpper < tickCurrent) {
        token0amount = lp * (b - a) / (b * a) / 1e6;
        token1amount = 0;
    }
    else {
        token0amount = lp * (b - a) / (b * a) / 1e6;
        token1amount = lp * (c - b) / 1e18;
    }
    return {
        token0amount: token0amount,
        token1amount: token1amount,
        totalvalue: token0amount + token1amount * token0Price,
        token0Ratio: token0amount / (token0amount + token1amount * token0Price),
        token1Ratio: 1 - token0amount / (token0amount + token1amount * token0Price),
    };
}
/**
 * token列表
 * @returns
 */
export async function getTokenList() {
    const query = `
    {
        tokens {
          id
          symbol
          decimals
        }
    }
    `;
    return fetch(v3gqlurl, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
        tokenList = data.data.tokens;
        console.log(tokenList);
        return tokenList;
    })
        .catch(() => {
        tokenList = [];
    });
}
/**
 *
 * @returns
 */
export async function getPoolPrice() {
    const query = `
  {
    pools(where: {id: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e"}) {
      token0Price
      token1Price
      sqrtPrice
      tick
    }
  }
    `;
    return fetch(v3gqlurl, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
        let pools = data.data.pools[0];
        return pools;
    });
}
/**
 * 获取池子的tvl 24h
 * @returns
 */
export async function getDayTvl() {
    const query = `
  {
    poolDayDatas(orderBy: date, orderDirection: desc, first: 2) {
      pool {
        id
        token0 {
          symbol
          id
        }
        token1 {
          symbol
          id
        }
      }
      date
      tvlUSD
      volumeUSD
    }
  }
    `;
    return fetch(v3gqlurl, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
        let day0 = data.data.poolDayDatas[0];
        let day1 = data.data.poolDayDatas[1];
        return {
            data: {
                tvlUSD: +day1.tvlUSD - +day0.tvlUSD,
                volumeUSD: +day1.volumeUSD - +day0.volumeUSD,
            }
        };
    });
}
/**
 * 风险图表
 * @param sid
 * @returns
 */
export async function riskManagement(sid) {
    const query = `
  {
    switchEntities(where: {sid: "${sid}"}) {
      timestamp
      accSwitch0
      accSwitch1
    }
  }
    `;
    return fetch(strategyurl, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
        let switchEntities = data.data.switchEntities;
        return {
            data: switchEntities,
        };
    });
}
//# sourceMappingURL=graphql.js.map