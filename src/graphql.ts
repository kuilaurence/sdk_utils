import { getTokenSymbol } from "./index";
import { userInfo } from "./lib_const";
import { getDecimal, convertBigNumberToNormal } from "./lib.utils";

var rankList: { data: [] };
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
            return rankList = {
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
            rankList = { data: [] };
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
    const query = `
    {
        bundles {
          ethPriceUSD
        }
        ticks(first: 1000, skip: 0, where: {poolAddress:"${poolAddress}", tickIdx_lte: 210300, tickIdx_gte: 186300}) {
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
            let ticks = data.data.ticks;
            console.log("-------->", ethPriceUSD);
            console.log("-------->", ticks);
            // let history = data.data.positions;
            // return rankList = {
            //     data: history.map((item: any) => {
            //         return {
            //             ...item,
            //         };
            //     }),
            // };
        })
        .catch(() => {
            rankList = { data: [] };
        });
}
/**
 * 获取tokens
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