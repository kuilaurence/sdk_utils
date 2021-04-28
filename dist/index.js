import { userInfo, tokenAddres, ContractAddress } from "./lib_const";
import { ERC20, ETQUERY, LPMINING, RECOMMEND, NODEMINING, INVITEREWARD, PLEDGEMINING, EXCHANGETOKEN } from "./lib_abi";
import { mul, web3, Trace, findToken, getDecimal, convertBigNumberToNormal, convertNormalToBigNumber, executeContract, toPrecision as _toPrecision, logout as _logout, sleep as _sleep, connect as _connect, getBalance as _getBalance, getAllowance as _getAllowance, approveToken as _approveToken, isETHAddress as _isETHAddress } from "./lib.utils";
export const T = Trace;
export const sleep = _sleep;
export const logout = _logout;
export const connect = _connect;
export const getBalance = _getBalance;
export const toPrecision = _toPrecision;
export const approveToken = _approveToken;
export const isETHAddress = _isETHAddress;
export var rankList;
export function getTokenSymbol(token_address) {
    let symbol = findToken(tokenAddres[userInfo.chainID], token_address);
    return symbol || "not know";
}
export async function getAllowance(token_address, type) {
    let destina_address = "";
    if (type === "USDT") {
        destina_address = ContractAddress[userInfo.chainID].exchangeToken;
    }
    else if (type === "ETHST") {
        destina_address = ContractAddress[userInfo.chainID].pledgeMining;
    }
    else {
        destina_address = ContractAddress[userInfo.chainID].lpMining;
    }
    return await _getAllowance(token_address, destina_address);
}
export function getApproveTokens(token_symbol) {
    return tokenAddres[userInfo.chainID][token_symbol];
}
export async function GetIntroducerBind() {
    let recommendContract = new web3.eth.Contract(RECOMMEND, ContractAddress[userInfo.chainID].recommend);
    let res = await recommendContract.methods.GetIntroducerBind(userInfo.account).call();
    if (res) {
        let address = await recommendContract.methods.GetIntroducer(userInfo.account).call();
        return address;
    }
    else {
        return "";
    }
}
export async function queryInvite() {
    let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID].etQuery);
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
export async function getNodeInfo() {
    let nodeMiningContract = new web3.eth.Contract(NODEMINING, ContractAddress[userInfo.chainID].nodeMining);
    let contributionTotal = await nodeMiningContract.methods.Contribution_Total().call();
    let user = await nodeMiningContract.methods.getUserInfo(userInfo.account).call();
    let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID].etQuery);
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
export async function farmingInfo() {
    let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID].etQuery);
    let EthstPoolInfo = await etQueryContract.methods.queryEthstPool(userInfo.account, tokenAddres[userInfo.chainID].WETH, tokenAddres[userInfo.chainID].USDT).call();
    let totalAmount = convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18);
    let ET_DailyOutput = convertBigNumberToNormal(EthstPoolInfo.ET_DailyOutput, 18);
    let ETH_DailyOutput = convertBigNumberToNormal(EthstPoolInfo.ETH_DailyOutput, 18);
    let etPrice = +convertBigNumberToNormal(EthstPoolInfo.ET_reserveA, 18) / +convertBigNumberToNormal(EthstPoolInfo.ET_reserveB, 18);
    let ethPrice = +convertBigNumberToNormal(EthstPoolInfo.ETH_reserveA, 18) / +convertBigNumberToNormal(EthstPoolInfo.ETH_reserveB, 18);
    let ethstPrice = +convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveA, 18) / +convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveB, 18);
    let EthstPoolApy = calculateETApy(+ET_DailyOutput, etPrice, +ETH_DailyOutput, ethPrice, +totalAmount, ethstPrice);
    let ETHSTUSDTPoolInfo = await etQueryContract.methods.queryLpPool(userInfo.account, tokenAddres[userInfo.chainID].ETHST, tokenAddres[userInfo.chainID].USDT).call();
    let totalAmount0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.totalAmount, 18);
    let lpTotal0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.lpTotal, 18);
    let ET_DailyOutput0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.dailyOutput, 18);
    let lp_reserveB0 = convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);
    let etPrice0 = +convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveA, 18) / +convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveB, 18);
    let ETHSTUSDTPoolApy = calculateLPApy(+ET_DailyOutput0, etPrice0, +lp_reserveB0, +totalAmount0, +lpTotal0);
    let lpPrice0 = +convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveA, 18) / +convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);
    let ETUSDTPoolInfo = await etQueryContract.methods.queryLpPool(userInfo.account, tokenAddres[userInfo.chainID].ET, tokenAddres[userInfo.chainID].USDT).call();
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
function calculateETApy(ETDailyOutPut, etPrice, ETHDailyOutPut, ethPrice, totalAmount, ethstPrice) {
    return ((ETDailyOutPut * etPrice * 365 + ETHDailyOutPut * ethPrice * 365) / (totalAmount * ethstPrice));
}
function calculateLPApy(ETDailyOutPut, etPrice, lp_reserveB, totalAmount, lpTotal) {
    return ((ETDailyOutPut * etPrice * 365) / (((lp_reserveB * 2) / lpTotal) * totalAmount));
}
export async function getCurrentRecord() {
    let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID].etQuery);
    let ETHSTTotal = await etQueryContract.methods.queryETHSTTotal().call();
    return {
        data: {
            total: convertBigNumberToNormal(ETHSTTotal.total, 18),
            sellTotal: convertBigNumberToNormal(ETHSTTotal.sellTotal, 18),
            buyTotal: convertBigNumberToNormal(ETHSTTotal.buyTotal, 18),
        },
    };
}
export async function homeData() {
    let etQueryContract = new web3.eth.Contract(ETQUERY, ContractAddress[userInfo.chainID].etQuery);
    let homeData = await etQueryContract.methods.queryHomeData(userInfo.account, tokenAddres[userInfo.chainID].ET, tokenAddres[userInfo.chainID].WETH, tokenAddres[userInfo.chainID].USDT).call();
    return {
        data: {
            ETHSTprice: +convertBigNumberToNormal(homeData.ETHST_reserveA, 18) / +convertBigNumberToNormal(homeData.ETHST_reserveB, 18),
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
export async function buy(_amount, husdEthstRatio, id, callback) {
    let exchangeTokenContract = new web3.eth.Contract(EXCHANGETOKEN, ContractAddress[userInfo.chainID].exchangeToken);
    let amount = mul(_amount, husdEthstRatio);
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(getApproveTokens('USDT')));
    executeContract(exchangeTokenContract, "buy", 0, [bigAmount, id], callback);
}
export function API_BindEx(address, callback) {
    let recommendContract = new web3.eth.Contract(RECOMMEND, ContractAddress[userInfo.chainID].recommend);
    executeContract(recommendContract, "API_BindEx", 0, [address], callback);
}
export function withdrawBindReward(callback) {
    let InviteRewardContract = new web3.eth.Contract(INVITEREWARD, ContractAddress[userInfo.chainID].inviteReward);
    executeContract(InviteRewardContract, "withdraw", 0, [], callback);
}
export function withdrawNodeReward(callback) {
    let nodeMiningContract = new web3.eth.Contract(NODEMINING, ContractAddress[userInfo.chainID].nodeMining);
    executeContract(nodeMiningContract, "withdraw", 0, [], callback);
}
export function stake(type, amount, callback) {
    let bigAmount = convertNormalToBigNumber(amount, 18);
    if (type === "ETHST") {
        let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID].pledgeMining);
        executeContract(pledgeMiningContract, "stakeEthSt", 0, [bigAmount], callback);
    }
    else if (type === "ETHSTUSDT") {
        let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID].lpMining);
        executeContract(lpMiningContract, "stackLp", 0, ['0', bigAmount], callback);
    }
    else {
        let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID].lpMining);
        executeContract(lpMiningContract, "stackLp", 0, ['1', bigAmount], callback);
    }
}
export function remove(type, amount, callback) {
    let bigAmount = convertNormalToBigNumber(amount, 18);
    if (type === "ETHST") {
        let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID].pledgeMining);
        executeContract(pledgeMiningContract, "removeEthSt", 0, [bigAmount], callback);
    }
    else if (type === "ETHSTUSDT") {
        let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID].lpMining);
        executeContract(lpMiningContract, "removeLp", 0, ["0", bigAmount], callback);
    }
    else {
        let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID].lpMining);
        executeContract(lpMiningContract, "removeLp", 0, ["1", bigAmount], callback);
    }
}
export function harvestET(type, callback) {
    if (type == "ETHST") {
        let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID].pledgeMining);
        executeContract(pledgeMiningContract, "withdraw_ET", 0, [], callback);
    }
    else if (type === "ETHSTUSDT") {
        let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID].lpMining);
        executeContract(lpMiningContract, "withdrawIncome", 0, ["0"], callback);
    }
    else {
        let lpMiningContract = new web3.eth.Contract(LPMINING, ContractAddress[userInfo.chainID].lpMining);
        executeContract(lpMiningContract, "withdrawIncome", 0, ["1"], callback);
    }
}
export function withdraw_ETH(callback) {
    let pledgeMiningContract = new web3.eth.Contract(PLEDGEMINING, ContractAddress[userInfo.chainID].pledgeMining);
    executeContract(pledgeMiningContract, "withdraw_ETH", 0, [], callback);
}
export async function test(callback) {
    let tokenContract = new web3.eth.Contract(ERC20, "0xae9269f27437f0fcbc232d39ec814844a51d6b8f");
    let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal("0xae9269f27437f0fcbc232d39ec814844a51d6b8f"));
    executeContract(tokenContract, "approve", 0, ["0xA94507E3bd5e3Cd414b37456ba716A92F4877d6e", bigAmount], callback);
}
export async function networkHashrateInfo() {
    return fetch("https://api.ethst.io/api/v1/pool/v1/currency/stats?currency=ETH", { method: "get" }).then((response) => {
        return response.json();
    });
}
export function getRankList() {
    return rankList;
}
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
            data: nodeMiningStakes.map((item) => {
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
//# sourceMappingURL=index.js.map