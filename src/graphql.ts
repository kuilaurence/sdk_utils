import { getTokenSymbol, collect } from "./index";
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
      accInvest0
      accInvest1
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
      return strategyEntities.map((item: any) => {
        let currPriceLower = calculatePrice(item.currTickLower);
        let currPriceUpper = calculatePrice(item.currTickUpper);
        if (currPriceLower > currPriceUpper) {
          [currPriceLower, currPriceUpper] = [currPriceUpper, currPriceLower]
        }
        let token0token1Info = calculatetoken0token1(item.currTickLower, res.tick, item.currTickUpper, item.currLiquidity, res.sqrtPrice, res.token0Price);
        return {
          ...item,
          ...token0token1Info,
          currPriceLower: currPriceLower,
          currPriceUpper: currPriceUpper,
          token0Price: res.token0Price,
          token1Price: res.token1Price,
          sqrtPrice: res.sqrtPrice,
          tick: res.tick,
          accumulativedee: +item.accFee0 + +item.accFee1 * +res.token0Price,
        }
      })
    }).then(data => {
      data.sort((a: any, b: any) => { return a.sid - b.sid });
      for (var i = 0; i < data.length; i++) {
        if (data[i].end) {
          data.splice(i, 1);
          i -= 1;
        }
      }
      const sids = data.map((item: any) => item.sid)
      //@ts-ignore
      sids.reduce(async (pre, sid, i) => {
        let result = await collect(sid);
        data[i]["fee0"] = convertBigNumberToNormal(result.data.fee0, 6)
        data[i]["fee1"] = convertBigNumberToNormal(result.data.fee1, 18)

        data[i]["fee0"] = +data[i]["accFee0"] + +data[i]["fee0"]
        data[i]["fee1"] = +data[i]["accFee1"] + +data[i]["fee1"]
        data[i]["fee0"] = data[i]["fee0"].toFixed(8)
        data[i]["fee1"] = data[i]["fee1"].toFixed(8)
        data[i]["accumulativedee"] = +  data[i]["fee0"] + + data[i]["fee1"] * +data[i].token0Price;
        data[i]["accumulativedee"] = data[i]["accumulativedee"].toFixed(8);
        return 1
      }, 1)
      return data
    })
}
function calculatePrice(tick: number) {
  return 1 / Math.pow(1.0001, tick) * 1e12;
}
export function calculatetoken0token1(tickLower: number, tickCurrent: number, tickUpper: number, lp: number, sqrtPrice: number, token0Price: number) {
  let a = Math.sqrt(Math.pow(1.0001, tickLower));
  let b = sqrtPrice / Math.pow(2, 96);
  let c = Math.sqrt(Math.pow(1.0001, tickUpper));
  let token0amount = 0;
  let token1amount = 0;
  if (b <= a) {
    token0amount = lp * (c - a) / (c * a) / 1e6;
    token1amount = 0;
  } else if (c <= b) {
    token0amount = 0;
    token1amount = lp * (c - a) / 1e18;
  } else {
    token0amount = lp * (b - a) / (b * a) / 1e6;
    token1amount = lp * (c - b) / 1e18;
  }
  return {
    token0amount: token0amount,
    token1amount: token1amount,
    totalvalue: token0amount + token1amount * token0Price,
    token0Ratio: token0amount / (token0amount + token1amount * token0Price),
    token1Ratio: 1 - token0amount / (token0amount + token1amount * token0Price),
    sumLiquidity: token0amount + token1amount * token0Price,
  }
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
      return tokenList
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
      return pools
    })
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
      }
    })
}
/**
 * 风险图表
 * @param sid 
 * @returns 
 */
export async function riskManagement(sid: string) {
  const query = `
  {
    switchEntities(orderBy: timestamp,where: {sid: "${sid}"}) {
      position {
        tick {
          sqrtPriceX96
        }
      }
      accInvest0
      accInvest1
      timestamp
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
      let switchEntities = data.data.switchEntities.map((item: any) => {
        return {
          ...item,
          price: (1 / Math.pow(+item.position.tick.sqrtPriceX96 / (Math.pow(2, 96)), 2) * 1e12).toFixed(6)
        }
      });
      let unbalanced0 = switchEntities.length > 0 ? switchEntities[switchEntities.length - 1].accInvest0 : 0;
      let unbalanced1 = switchEntities.length > 0 ? switchEntities[switchEntities.length - 1].accInvest1 : 0;
      return {
        data: {
          unbalanced0: unbalanced0,
          unbalanced1: unbalanced1,
          hedgingPrice: 1,
          switchEntities,
        }
      }
    })
}
/**
 * 拿performance图表数据
 * @param sid 
 * @returns 
 */
export async function performance(sid: string) {
  const query = `
  {
    collectEntities(orderBy: timestamp, where: {sid: "${sid}"}) {
      timestamp
      accFee0
      accFee1
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
      let collectEntities = data.data.collectEntities;
      let accumulativefees0 = collectEntities.length > 0 ? collectEntities[collectEntities.length - 1].accFee0 : 0;
      let accumulativefees1 = collectEntities.length > 0 ? collectEntities[collectEntities.length - 1].accFee1 : 0;
      return {
        data: {
          accumulativefees0: accumulativefees0,
          accumulativefees1: accumulativefees1,
          annualfee: 0.0,
          collectEntities
        }
      }
    })
}
/**
 * 池子价格变化
 * @returns 
 */
export async function getPoolHourPrices(poolAddress: string, timestame: string) {
  const query = `
  {
    poolHourDatas(orderBy: timestamp, first: 1000, where: {timestamp_gt: "${timestame}", pool: "${poolAddress}"}) {
      timestamp
      token0Price
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
      let poolHourDatas = data.data.poolHourDatas;
      return {
        poolHourDatas
      }
    })
}
/**
 * 建仓时间
 * @param sid 
 * @returns 
 */
export async function getCreatStrategyinfo(sid: string) {
  const query = `
  {
    strategyEntities(where: {sid: "${sid}"}) {
      position {
        tick {
          timestamp
          tickLower
          tickUpper
        }
      }
      switching (orderBy:timestamp,first:500){
        position {
          tick {
            timestamp
            tickLower
            tickUpper
          }
        }
      }
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
      let priceLower = calculatePrice(+data.data.strategyEntities[0].position.tick.tickLower);
      let priceUpper = calculatePrice(+data.data.strategyEntities[0].position.tick.tickUpper);
      if (priceLower > priceUpper) {
        [priceLower, priceUpper] = [priceUpper, priceLower];
      }
      let firstPosition = {
        priceLower: priceLower,
        priceUpper: priceUpper,
        timestamp: data.data.strategyEntities[0].position.tick.timestamp,
      }
      let switchingdetail = data.data.strategyEntities[0].switching.map((item: any) => {
        let priceLower = calculatePrice(+item.position.tick.tickLower);
        let priceUpper = calculatePrice(+item.position.tick.tickUpper);
        if (priceLower > priceUpper) {
          [priceLower, priceUpper] = [priceUpper, priceLower];
        }
        return {
          priceLower: priceLower,
          priceUpper: priceUpper,
          timestamp: item.position.tick.timestamp,
        }
      })
      switchingdetail.unshift(firstPosition);
      return {
        switchingdetail
      }
    })
}
/**
 * 分析report图表数据
 * @param sid 
 */
export async function report(poolAddress: string, sid: string) {
  let res1 = await getCreatStrategyinfo(sid);
  let firstTimestemp = res1.switchingdetail[0].timestamp;
  let timestame = (Number(firstTimestemp) - 1800).toString();
  let res2 = await getPoolHourPrices(poolAddress, timestame);
  let totalswitchcount = res1.switchingdetail.length - 1;
  let day24hswitchcount = 0;
  let day24htimestamp = Math.floor(Date.now() / 1000) - 86400;
  for (let i = res1.switchingdetail.length - 1; i > 0; i--) {
    if (+res1.switchingdetail[i].timestamp > day24htimestamp) {
      day24hswitchcount++;
    } else {
      break;
    }
  }
  let resultList: any = [];
  res1.switchingdetail.forEach((item: any) => {
    resultList.push({
      type: "L",
      price: +Number(item.priceLower).toFixed(6),
      timestamp: +item.timestamp,
    })
    resultList.push({
      type: "U",
      price: +Number(item.priceUpper).toFixed(6),
      timestamp: +item.timestamp,
    })
  });
  res2.poolHourDatas.forEach((item: any) => {
    resultList.push({
      type: "C",
      price: +Number(item.token0Price).toFixed(6),
      timestamp: +item.timestamp,
    })
  });

  return {
    data: {
      day24hswitchcount: day24hswitchcount,
      totalswitchcount: totalswitchcount,
      result: resultList.sort((a: any, b: any) => a.type > b.type ? -1 : 1)
    }
  }
}