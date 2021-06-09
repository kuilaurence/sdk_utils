import { getTokenSymbol } from "./index";
import { userInfo } from "./lib_const";
import { convertBigNumberToNormal } from "./lib.utils";

import { tickToPrice, priceToClosestTick } from "@uniswap/v3-sdk";
import { Price, Token } from "@uniswap/sdk-core";
import { getV3LP } from "./api2";

function getprice(tick: number) {
    let token0 = new Token(1, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 6);//usdt
    let token1 = new Token(1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 18);//eth
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

/**
 * x*y=l
 * x/y=price
 * @param tick 
 * @param liquidity 
 */
function gettokensLock(token0_address: string, token1_address: string, tick: number, liquidity: number) {
    let token0 = new Token(1, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 6);//usdt
    let token1 = new Token(1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 18);//eth
    let price0 = tickToPrice(token0, token1, tick).toFixed(4);
    let price1 = tickToPrice(token1, token0, tick).toFixed(4);
    let locakToken0 = Math.sqrt(liquidity / +price0);
    let locakToken1 = Math.sqrt(liquidity / +price1);
    return {
        data: {
            locakToken0: locakToken0,
            locakToken1: locakToken1,
        }
    }
}

var tokenList: [];

let graphql = "https://api.thegraph.com/subgraphs/name/winless/multiple";
let playground = "http://120.92.137.203:9002/subgraphs/name/multiple/graph";

// export async function networkHashrateInfo() {
//     return fetch("https://api.ethst.io/api/v1/pool/v1/currency/stats?currency=ETH", { method: "get" }
//     ).then((response) => {
//         return response.json();
//     });
// }
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
let poolAddress = "0xe7F7EEbc62f0ab73E63A308702A9d0B931A2870e";
let tickIdxLowerBound = 81770;
let tickIdxUpperBound = 82770;
let skip = 0;
/**
 * 获取池子信息
 * @returns 
 */
export async function getPositionInfo() {
    let res = await getV3LP();
    return {
        data: {
            ticks: res,
        }
    }
}
export async function getPositionInfo2() {
    const query = `
    {
        bundles {
          ethPriceUSD
        }
        pool(id: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e") {
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
        ticks(first: 1000, skip: 0, where: {poolAddress: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e", tickIdx_lte: 210300, tickIdx_gte: 186300}) {
          tickIdx
          liquidityGross
          liquidityNet
          price0
          price1
        }
      }
      `;
    return fetch(playground, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json())
        .then((data) => {
            let ethPriceUSD = data.data.bundles[0].ethPriceUSD;
            let poolInfo = data.data.pool;
            let ticks = data.data.ticks;
            ticks = ticks.map((item: any) => {
                let res = getprice(+item.tickIdx);
                let lockInfo = gettokensLock("", "", +item.tickIdx, +item.liquidityGross);
                return {
                    ...item,
                    price0: res.data.price0,
                    price1: res.data.price1,
                    token0Lock: lockInfo.data.locakToken0,
                    token1Lock: lockInfo.data.locakToken1,
                };
            });
            return {
                data: {
                    ticks: ticks,
                    poolInfo: poolInfo,
                    ethPriceUSD: ethPriceUSD,
                }
            }
        })
        .catch(() => {
            return { data: [] };
        });
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
    return fetch(playground, {
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