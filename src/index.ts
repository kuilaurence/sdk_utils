import { userInfo, tokenAddres, ContractAddress } from "./lib_config";
import { ERC20, MULBANK, MULWORK, UNISWAPV3POOL, UNISWAPV3STRATEGY } from "./lib_abi";
import { web3, Trace, getBalance, findToken, getDecimal, convertBigNumberToNormal, getAllowance as _getAllowance } from "./lib.utils";
export { approveToken, deposit, withdraw, invest, addInvest, switching, divest, createAccount } from "./execute";
export { add, sub, mul, div, sleep, logout, Trace, connect, toPrecision, getBalance, isETHAddress, changeMetamaskChain } from "./lib.utils";
export { getinvestList, getCreatStrategyinfo, getDayTvl, getGPRankList, getPoolHourPrices, getPoolPrice, getPositionInfo, getSingleStrategy, getTokenList, strategyEntities, riskManagement, performance, report, faucet, checkFaucet } from "./graphql";
export const T = Trace;

/**
 * 根据token symbol获取address
 * @param token_symbol 
 * @returns 
 */
export function getTokenAddress(token_symbol: string) {
  return tokenAddres[userInfo.chainID][token_symbol as keyof typeof tokenAddres[128]];
}
/**
 * 根据token address,获取symbol
 * @param token_address 
 * @returns 
 */
export function getTokenSymbol(token_address: string) {
  let symbol = findToken(tokenAddres[userInfo.chainID], token_address);
  return symbol || "unknow";
}
/**
 * 获取授权值
 * @param token_address 
 * @param type 
 * @returns 
 */
export async function getAllowance(token_address: string, type: "deposit" | "invest") {
  let destina_address = ContractAddress[userInfo.chainID].mulBank;
  if (type === "deposit") {

  } else if (type === "invest") {
    destina_address = ContractAddress[userInfo.chainID].v3strategy;
  }
  return await _getAllowance(token_address, destina_address);
}
/**
 * 池子存的数量 
 * @param token_address 
 * @returns 
 */
export async function poolInfo(token_address: string) {
  let decimal = await getDecimal(token_address);
  let mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
  let _totalShare = await mulBankContract.methods.getTotalShare(token_address).call({ from: userInfo.account });
  let totalShare = convertBigNumberToNormal(_totalShare, decimal);

  let res = await mulBankContract.methods.poolInfo(token_address).call({ from: userInfo.account });
  let tokenContract = new web3.eth.Contract(ERC20, res.shareToken);

  let _shareTokenTotalSupply = await tokenContract.methods.totalSupply().call({ from: userInfo.account });
  let shareTokenTotalSupply = convertBigNumberToNormal(_shareTokenTotalSupply, decimal);

  let shareTokenBalance = await getBalance(res.shareToken);

  let reward = '0';
  if (+shareTokenTotalSupply <= 0) {
    reward = '0';
  } else {
    reward = (+shareTokenBalance - (+shareTokenBalance * +totalShare / +shareTokenTotalSupply)).toFixed(8);
  }
  return {
    data: {
      supplyToken: res.supplyToken,
      shareToken: res.shareToken,
      shareTokenBalance: shareTokenBalance,
      reward: reward,
      totalBorrow: convertBigNumberToNormal(res.totalBorrow, decimal),
      loss: convertBigNumberToNormal(res.loss, decimal),
      totalDeposit: convertBigNumberToNormal(res.totalDeposit, decimal),
    }
  }
}
/**
 * 投资前查询创建的账户信息
 * @returns 
 */
export async function workers() {
  let mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
  let res = await mulWorkContract.methods.workers(userInfo.account).call({ from: userInfo.account });
  return {
    data: {
      createTime: res.createTime,
      created: res.created,
      lastWorkTime: res.lastWorkTime,
      power: res.power,
      totalProfit: res.totalProfit,
      workerId: res.workerId
    }
  }
}
/**
 * 拿fee
 * @param sid 
 * @returns 
 */
export async function collect(sid: string) {
  let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
  let res = await v3strategyContract.methods.collect(+sid).call({ from: userInfo.account });
  return {
    data: {
      fee0: convertBigNumberToNormal(res.fee0, 6),
      fee1: convertBigNumberToNormal(res.fee1, 18),
    }
  }
}
/**
 * 
 * @param token0_address 
 * @param token1_address 
 * @param ratio 价格
 * @returns 
 */
export function getTick(token0_address: string, token1_address: string, price: number) {
  let space = 60;
  if (Number(token0_address) > Number(token1_address)) {
    let temp = token0_address;
    token0_address = token1_address;
    token1_address = temp;
  }
  let ans = Math.floor(Math.log2(1 / price * 1e12) / Math.log2(1.0001));
  if (Math.log2(1 / price * 1e12) > 0) {
    if (ans % space >= space / 2) {
      ans = ans + space - ans % space;
    } else {
      ans = ans - ans % space;
    }
    return ans.toString();
  }
  else {
    return (ans - (200 - Math.abs(ans) % space)).toString();
  }
}
/**
 * 获取池子的价格（暂时只有 usdt/btc）
 * @param token0_address 
 * @param token1_address 
 * @returns 
 */
export async function getSqrtPrice(token0_address: string, token1_address: string) {
  if (Number(token0_address) > Number(token1_address)) {
    [token0_address, token1_address] = [token1_address, token0_address];
  }
  let v3poolContract = new web3.eth.Contract(UNISWAPV3POOL, ContractAddress[userInfo.chainID].v3pool);
  let res = await v3poolContract.methods.slot0().call({ from: userInfo.account });
  let temp = Math.pow(res.sqrtPriceX96 / (Math.pow(2, 96)), 2);
  return 1 / temp * 1e12;
}
/**
 * 获取投资最大值
 * @param token0_address 
 * @param token1_address 
 * @returns 
 */
export async function getRemainQuota(token0_address: string, token1_address: string) {
  let mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
  let remain0 = await mulWorkContract.methods.getRemainQuota(userInfo.account, token0_address).call({ from: userInfo.account });
  let remain1 = await mulWorkContract.methods.getRemainQuota(userInfo.account, token1_address).call({ from: userInfo.account });
  return {
    data: {
      token0: token0_address,
      symbol0: getTokenSymbol(token0_address),
      remain0: convertBigNumberToNormal(remain0, await getDecimal(token0_address)),
      token1: token1_address,
      symbol1: getTokenSymbol(token1_address),
      remain1: convertBigNumberToNormal(remain1, await getDecimal(token1_address)),
    }
  }
}
/**
 *算出对应token的量  sqrtPrice = sqrt(b/a) * 2^96 = sqrt(1.0001^tick) * 2^96
 * @param type 
 * @param token0_address 
 * @param token1_address 
 * @param priceLower 
 * @param priceCurrent 
 * @param priceUpper 
 * @param amount 
 * @returns c * b / (c - b) * (b - a);      c a  互换位置
 */
export async function getTokenValue(type: "token0" | "token1", token0_address: string, token1_address: string, priceLower: number, priceCurrent: number, priceUpper: number, amount: number) {
  let v3poolContract = new web3.eth.Contract(UNISWAPV3POOL, ContractAddress[userInfo.chainID].v3pool);
  let res = await v3poolContract.methods.slot0().call({ from: userInfo.account });
  let resultAmount = 0;
  let tickLower = getTick(token0_address, token1_address, priceLower);
  let tickUpper = getTick(token0_address, token1_address, priceUpper);
  if (+tickLower > +tickUpper) {
    [tickLower, tickUpper] = [tickUpper, tickLower];
  }
  let sqrtPricelower = Math.sqrt(Math.pow(1.0001, +tickLower))
  let sqrtPriceupper = Math.sqrt(Math.pow(1.0001, +tickUpper))
  let a = sqrtPricelower;
  let b = res.sqrtPriceX96 / (Math.pow(2, 96));
  let c = sqrtPriceupper;

  if (type === "token0") {//usdt
    let temp = c * b / (c - b) * (b - a);
    resultAmount = temp / 1e12 * amount;
  } else {//eth
    let temp = (c - b) / (b - a) / (b * c);
    resultAmount = temp * 1e12 * amount;
  }
  return { amount: resultAmount }
}
/**
 * 拿tick上的价格
 * @param token0_address 
 * @param token1_address 
 * @param price 
 * @returns 
 */
export function getCloseToTickPrice(token0_address: string, token1_address: string, price: number) {
  let tick = getTick(token0_address, token1_address, price);
  return 1 / Math.pow(1.0001, +tick) * 1e12;
}