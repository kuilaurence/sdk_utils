import { userInfo, tokenAddres, ContractAddress } from "./lib_const";
import { ERC20, ETQUERY, LPMINING, RECOMMEND, NODEMINING, INVITEREWARD, PLEDGEMINING, EXCHANGETOKEN } from "./lib_abi";
import {
  add, sub, mul, div, web3, findToken, getDecimal,
  convertBigNumberToNormal, convertNormalToBigNumber, executeContract,
  logout as _logout, connect as _connect, getBalance as _getBalance, getAllowance as _getAllowance,
  approveToken as _approveToken, isETHAddress as _isETHAddress
} from "./lib.utils";

export const logout = _logout;
export const connect = _connect;
export const getBalance = _getBalance;
export const approveToken = _approveToken;
export const isETHAddress = _isETHAddress;

export var tokenDic: {};
export var rankList: { data: [] };
/**
 * 获取symbol
 * @param token_address 
 * @returns 
 */
export function getTokenSymbol(token_address: string) {
  let symbol = findToken(tokenAddres[userInfo.chainID as keyof typeof tokenAddres], token_address);
  return symbol || "not know";
}
/**
 * 获取授权值   type  buy  //币的名字
 * @param token_address 
 * @param type 
 * @returns 
 */
export async function getAllowance(token_address: string, type: string) {
  let destina_address = "";
  if (type === "USDT") {
    destina_address = ContractAddress[userInfo.chainID as keyof typeof ContractAddress].exchangeToken;
  } else if (type === "ETHST") {
    destina_address = ContractAddress[userInfo.chainID as keyof typeof ContractAddress].pledgeMining;
  } else {
    destina_address = ContractAddress[userInfo.chainID as keyof typeof ContractAddress].lpMining;
  }
  return await _getAllowance(token_address, destina_address);
}
/**
 * 获得approvetoken address
 * @param token_symbol 
 * @returns 
 */
export function getApproveTokens(token_symbol: string) {
  return tokenAddres[userInfo.chainID as keyof typeof tokenAddres][token_symbol as keyof typeof tokenAddres[128]];
}
/**
 * 是否绑定上级
 * @returns 
 */
export async function GetIntroducerBind() {
  let recommendContract = new web3.eth.Contract(RECOMMEND, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].recommend);
  let res = await recommendContract.methods.GetIntroducerBind(userInfo.account).call();
  if (res) {
    let address = await recommendContract.methods.GetIntroducer(userInfo.account).call();
    return address;
  } else {
    return "";
  }
}
/**
 * 奖励页面
 * @returns 
 */
export async function queryInvite() {
  let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].etQuery);
  let inviteInfo = await etQueryContract.methods.queryInvite(userInfo.account).call();
  return {
    data: {
      firstLevelCount: inviteInfo.firstLevelCount,
      firstLevelAmount: convertBigNumberToNormal(inviteInfo.firstLevelAmount, 18),
      secondLevelCount: inviteInfo.secondLevelCount,
      secondLevelAmount: convertBigNumberToNormal(inviteInfo.secondLevelAmount, 18),
      reward: convertBigNumberToNormal(inviteInfo.reward, 18),
    },
  };
}
/*
 *totalContribution  贡献价值总数
 *totalvalue         当前奖池总金额
 *amount             自己的贡献值
 *reward             自己的待领取收益
 */
export async function getNodeInfo() {
  let nodeMiningContract = new web3.eth.Contract(NODEMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].nodeMining);
  let contributionTotal = await nodeMiningContract.methods.Contribution_Total().call();
  let user = await nodeMiningContract.methods.getUserInfo(userInfo.account).call();

  let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].etQuery);
  let ETReward = await etQueryContract.methods.getNodeReward().call();
  return {
    data: {
      totalvalue: convertBigNumberToNormal(ETReward, 18),
      totalContribution: convertBigNumberToNormal(contributionTotal, 18),
      amount: convertBigNumberToNormal(user.amount, 18),
      reward: convertBigNumberToNormal(user.reward, 18),
    },
  };
}
/**
 * farming页面信息
 * @returns 
 */
export async function farmingInfo() {
  let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].etQuery);
  let EthstPoolInfo = await etQueryContract.methods.queryEthstPool(userInfo.account, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].WETH, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].USDT).call();
  let totalAmount = convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18);
  let ET_DailyOutput = convertBigNumberToNormal(EthstPoolInfo.ET_DailyOutput, 18);
  let ETH_DailyOutput = convertBigNumberToNormal(EthstPoolInfo.ETH_DailyOutput, 18);
  let etPrice = +convertBigNumberToNormal(EthstPoolInfo.ET_reserveA, 18) / +convertBigNumberToNormal(EthstPoolInfo.ET_reserveB, 18);
  let ethPrice = +convertBigNumberToNormal(EthstPoolInfo.ETH_reserveA, 18) / +convertBigNumberToNormal(EthstPoolInfo.ETH_reserveB, 18);
  let ethstPrice = + convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveA, 18) / + convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveB, 18);
  let EthstPoolApy = calculateETApy(+ET_DailyOutput, etPrice, +ETH_DailyOutput, ethPrice, +totalAmount, ethstPrice);

  let ETHSTUSDTPoolInfo = await etQueryContract.methods.queryLpPool(userInfo.account, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].ETHST, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].USDT).call();
  let totalAmount0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.totalAmount, 18);
  let lpTotal0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.lpTotal, 18);
  let ET_DailyOutput0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.dailyOutput, 18);
  let lp_reserveB0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);
  let etPrice0 = +convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveA, 18) / +convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveB, 18);
  let ETHSTUSDTPoolApy = calculateLPApy(+ET_DailyOutput0, etPrice0, +lp_reserveB0, +totalAmount0, +lpTotal0);
  let lpPrice0 = +convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveA, 18) / + convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);

  let ETUSDTPoolInfo = await etQueryContract.methods.queryLpPool(userInfo.account, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].ET, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].USDT).call();
  let totalAmount1 = convertBigNumberToNormal(ETUSDTPoolInfo.totalAmount, 18);
  let lpTotal1 = convertBigNumberToNormal(ETUSDTPoolInfo.lpTotal, 18);
  let ET_DailyOutput1 = convertBigNumberToNormal(ETUSDTPoolInfo.dailyOutput, 18);
  let lp_reserveB1 = convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveB, 18);
  let etPrice1 = +convertBigNumberToNormal(ETUSDTPoolInfo.ET_reserveA, 18) / +convertBigNumberToNormal(ETUSDTPoolInfo.ET_reserveB, 18);
  let ETUSDTPoolApy = calculateLPApy(+ET_DailyOutput1, etPrice1, +lp_reserveB1, +totalAmount1, +lpTotal1);
  let lpPrice1 = +convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveA, 18) / +convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveB, 18);

  return {
    data: {
      ETHPrice: ethPrice,
      ETHSTLockAmount: convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18),
      ETHST: {
        totalAmount: +convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18) * ethstPrice,
        userAmount: convertBigNumberToNormal(EthstPoolInfo.userAmount, 18),
        ethIncome: convertBigNumberToNormal(EthstPoolInfo.ethIncome, 18),
        ethTotalIncome: convertBigNumberToNormal(EthstPoolInfo.ethTotalIncome, 18),
        etIncome: convertBigNumberToNormal(EthstPoolInfo.etIncome, 18),
        etTotalIncome: convertBigNumberToNormal(EthstPoolInfo.etTotalIncome, 18),
        apy: EthstPoolApy,
      },
      ETHSTUSDT: {
        totalAmount: +convertBigNumberToNormal(ETHSTUSDTPoolInfo.totalAmount, 18) * lpPrice0,
        userAmount: convertBigNumberToNormal(ETHSTUSDTPoolInfo.userAmount, 18),
        etIncome: convertBigNumberToNormal(ETHSTUSDTPoolInfo.etIncome, 18),
        etTotalIncome: convertBigNumberToNormal(ETHSTUSDTPoolInfo.etTotalIncome, 18),
        apy: ETHSTUSDTPoolApy,
      },
      ETUSDT: {
        totalAmount: +convertBigNumberToNormal(ETUSDTPoolInfo.totalAmount, 18) * lpPrice1,
        userAmount: convertBigNumberToNormal(ETUSDTPoolInfo.userAmount, 18),
        etIncome: convertBigNumberToNormal(ETUSDTPoolInfo.etIncome, 18),
        etTotalIncome: convertBigNumberToNormal(ETUSDTPoolInfo.etTotalIncome, 18),
        apy: ETUSDTPoolApy,
      },
    },
  };
}
//et pool apy = ((ET单日产量 * 价格 * 365) + (ETH单日产量 * 价格 * 365)) /( totalAmount * ETHST价格)
function calculateETApy(ETDailyOutPut: number, etPrice: number, ETHDailyOutPut: number, ethPrice: number, totalAmount: number, ethstPrice: number) {
  return ((ETDailyOutPut * etPrice * 365 + ETHDailyOutPut * ethPrice * 365) / (totalAmount * ethstPrice));
}

//lp apy = (lp ET单日产量 * ET 价格 * 365) / ((lp_reserveB * 2 / lpTotal) * totalAmount)
function calculateLPApy(ETDailyOutPut: number, etPrice: number, lp_reserveB: number, totalAmount: number, lpTotal: number) {
  return ((ETDailyOutPut * etPrice * 365) / (((lp_reserveB * 2) / lpTotal) * totalAmount));
}
/**
 * 获取信息
 * @returns 
 */
export async function getCurrentRecord() {
  let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].etQuery);
  let ETHSTTotal = await etQueryContract.methods.queryETHSTTotal().call();
  return {
    data: {
      total: convertBigNumberToNormal(ETHSTTotal.total, 18),
      sellTotal: convertBigNumberToNormal(ETHSTTotal.sellTotal, 18),
      buyTotal: convertBigNumberToNormal(ETHSTTotal.buyTotal, 18),
    },
  };
}
/**
 * 首页
 * @returns 
 */
export async function homeData() {
  let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].etQuery);
  let homeData = await etQueryContract.methods.queryHomeData(userInfo.account, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].ET, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].WETH, tokenAddres[userInfo.chainID as keyof typeof ContractAddress].USDT).call();
  return {
    data: {
      ETHSTprice: +convertBigNumberToNormal(homeData.ETHST_reserveA, 18) / + convertBigNumberToNormal(homeData.ETHST_reserveB, 18),
      ETprice: +convertBigNumberToNormal(homeData.ET_reserveA, 18) / +convertBigNumberToNormal(homeData.ET_reserveB, 18),
      network: {
        ETHST_total: convertBigNumberToNormal(homeData.ETHST_total, 18),
        ETHST_circulation: convertBigNumberToNormal(homeData.ETHST_circulation, 18),
        ET_total: convertBigNumberToNormal(homeData.ET_total, 18),
        ET_circulation: convertBigNumberToNormal(homeData.ET_circulation, 18),
        ETH_release: convertBigNumberToNormal(homeData.ETH_release, 18),
      },
      my: {
        ETHST_balance: convertBigNumberToNormal(homeData.ETHST_balance, 18),
        ETHST_pledge: convertBigNumberToNormal(homeData.ETHST_pledge, 18),
        ET_balance: convertBigNumberToNormal(homeData.ET_balance, 18),
        ETH_user_release: convertBigNumberToNormal(homeData.ETH_user_release, 18),
      },
    },
  };
}
/**
 * 信息
 * @returns 
 */
export async function homeData2() {
  let _homedate = await homeData();
  let _farmingInfo = await farmingInfo();
  return {
    data: {
      ETHSTLockAmount: _farmingInfo.data.ETHSTLockAmount,
      ETHST_total: _homedate.data.network.ETHST_total,
      ETHPrice: _farmingInfo.data.ETHPrice,
      ETprice: _homedate.data.ETprice,
    },
  };
}
/**
 * 买ETHST
 * @param _amount 
 * @param husdEthstRatio 
 * @param id 
 * @param callback 
 */
export async function buy(_amount: string, husdEthstRatio: string, id: string, callback: (code: number, hash: string) => void) {
  let exchangeTokenContract = new web3.eth.Contract(EXCHANGETOKEN, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].exchangeToken);
  let amount = mul(_amount, husdEthstRatio);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(getApproveTokens('USDT')));
  executeContract(exchangeTokenContract, "buy", 0, [bigAmount, id], callback);
}
/**
 * 提现
 * @param address 
 * @param callback 
 */
export function API_BindEx(address: string, callback: (code: number, hash: string) => void) {
  let recommendContract = new web3.eth.Contract(RECOMMEND, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].recommend);
  executeContract(recommendContract, "API_BindEx", 0, [address], callback);
}
/**
 * 提取邀请奖励
 * @param callback 
 */
export function withdrawBindReward(callback: (code: number, hash: string) => void) {
  let InviteRewardContract = new web3.eth.Contract(INVITEREWARD, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].inviteReward);
  executeContract(InviteRewardContract, "withdraw", 0, [], callback);
}
/**
 * 提取节点奖励
 * @param callback 
 */
export function withdrawNodeReward(callback: (code: number, hash: string) => void) {
  let nodeMiningContract = new web3.eth.Contract(NODEMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].nodeMining);
  executeContract(nodeMiningContract, "withdraw", 0, [], callback);
}
/**
 * 质押ETHST
 * @param type 
 * @param amount 
 * @param callback 
 */
export function stake(type: string, amount: string, callback: (code: number, hash: string) => void) {
  let bigAmount = convertNormalToBigNumber(amount, 18);
  if (type === "ETHST") {
    let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].pledgeMining);
    executeContract(pledgeMiningContract, "stakeEthSt", 0, [bigAmount], callback);
  } else if (type === "ETHSTUSDT") {
    let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].lpMining);
    executeContract(lpMiningContract, "stackLp", 0, ['0', bigAmount], callback);
  } else {
    let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].lpMining);
    executeContract(lpMiningContract, "stackLp", 0, ['1', bigAmount], callback);
  }
}
/**
 * 移除ETHST
 * @param type 
 * @param amount 
 * @param callback 
 */
export function remove(type: string, amount: string, callback: (code: number, hash: string) => void) {
  let bigAmount = convertNormalToBigNumber(amount, 18);
  if (type === "ETHST") {
    let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].pledgeMining);
    executeContract(pledgeMiningContract, "removeEthSt", 0, [bigAmount], callback);
  } else if (type === "ETHSTUSDT") {
    let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].lpMining);
    executeContract(lpMiningContract, "removeLp", 0, ["0", bigAmount], callback);
  } else {
    let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].lpMining);
    executeContract(lpMiningContract, "removeLp", 0, ["1", bigAmount], callback);
  }
}
/**
 * 收取et
 * @param type 
 * @param callback 
 */
export function harvestET(type: string, callback: (code: number, hash: string) => void) {
  if (type == "ETHST") {
    let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].pledgeMining);
    executeContract(pledgeMiningContract, "withdraw_ET", 0, [], callback);
  } else if (type === "ETHSTUSDT") {
    let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].lpMining);
    executeContract(lpMiningContract, "withdrawIncome", 0, ["0"], callback);
  } else {
    let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].lpMining);
    executeContract(lpMiningContract, "withdrawIncome", 0, ["1"], callback);
  }
}
/**
 * 提取eth
 * @param callback 
 */
export function withdraw_ETH(callback: (code: number, hash: string) => void) {
  let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID as keyof typeof ContractAddress].pledgeMining);
  executeContract(pledgeMiningContract, "withdraw_ETH", 0, [], callback);
}
/**
 * test
 * @param callback 
 */
export async function test(callback: (code: number, hash: string) => void) {
  let tokenContract = new web3.eth.Contract(ERC20, "0xae9269f27437f0fcbc232d39ec814844a51d6b8f");
  let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal("0xae9269f27437f0fcbc232d39ec814844a51d6b8f"));
  executeContract(tokenContract, "approve", 0, ["0xA94507E3bd5e3Cd414b37456ba716A92F4877d6e", bigAmount], callback);
}

//----------------------------------------服务器信息-----------------------------------------------------------
/**
 * 拿全网算力
 * @returns 
 */
export async function networkHashrateInfo() {
  return fetch("https://api.ethst.io/api/v1/pool/v1/currency/stats?currency=ETH", { method: "get" }
  ).then((response) => {
    return response.json();
  });
}
/**
 * 拿贡献榜单
 * @returns 
 */
export function getRankList() {
  return rankList;
}
/**
 * 拿贡献榜单预先
 * @returns 
 */
export async function getRankListBefore() {
  const query = `
    {
        nodeMiningStakes(orderBy: amount, orderDirection: desc, first: 20) {
          id
          amount
        }
      }
    `;
  return fetch("https://api.ethst.io/subgraphs/name/ethst/ethst_project", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query, }),
  }).then((response) => response.json())
    .then((data) => {
      const nodeMiningStakes = data.data.nodeMiningStakes;
      rankList = {
        data: nodeMiningStakes.map((item: any) => {
          return {
            ...item,
            amount: convertBigNumberToNormal(item.amount, 18),
          };
        }),
      };
    })
    .catch(() => {
      rankList = { data: [] };
    });
}
