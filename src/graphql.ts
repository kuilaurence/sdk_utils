import { getTokenSymbol } from "./index";
import { userInfo } from "./lib_const";
import { convertBigNumberToNormal } from "./lib.utils";

import { tickToPrice, priceToClosestTick } from "@uniswap/v3-sdk";
import { Price, Token } from "@uniswap/sdk-core";
import { getV3LP } from "./api2";

export function getprice(token0_address: string, token1_address: string, tick: number) {
  let token0 = new Token(1, token0_address, 6);//usdt
  let token1 = new Token(1, token1_address, 18);//eth
  let price0 = tickToPrice(token0, token1, tick).toFixed(4);
  let price1 = tickToPrice(token1, token0, tick).toFixed(4);
  // console.log("--------", priceToClosestTick(new Price(token0, token1, 2643.5847 * 1e6, 1e18)));
  return {
    data: {
      price0: price0,
      price1: price1,
    }
  }
}
var tokenList: [];

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
        data: history.map((item: any) => {
          return {
            ...item,
            debt0: convertBigNumberToNormal(item.debt0, 18),
            debt1: convertBigNumberToNormal(item.debt1, 18),
            priceLower: Math.pow(1.0001, item.tickLower),
            priceUpper: Math.pow(1.0001, item.tickUpper),
            symbol0: getTokenSymbol(item.token0),
            symbol1: getTokenSymbol(item.token1),
          };
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
export async function getPositionInfo(poolAddress: string) {
  let res = await getV3LP();
  let res2 = await getPositionInfo2(poolAddress)
  return {
    data: {
      ticks: res,
      poolInfo: res2.poolInfo,
      ethPriceUSD: res2.ethPriceUSD,
    }
  }
}
/**
 * 填写pool地址
 * @param poolAddress 
 * @returns 
 */
export async function getPositionInfo2(poolAddress: string) {
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
      }
    })
}
/**
 * 获取strategy
 * @returns 
 */
export async function strategyEntities() {
  const query = `
  {
    strategyEntities(where: {user: "${userInfo.account}"}) {
      sid
      end
      pool
      accFee0
      accFee1
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
      return {
        data: strategyEntities.map((item: any) => {
          return {
            ...item,
            currPriceLower: calculatePrice(item.currTickLower),
            currPriceUpper: calculatePrice(item.currTickUpper),
          }
        })
      }
    })
}
function calculatePrice(tick: number) {
  return 1 / Math.pow(1.0001, tick) * 1e12;
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
      console.log(tokenList)
      return tokenList
    })
    .catch(() => {
      tokenList = [];
    });
}