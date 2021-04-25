"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRankListBefore = exports.getRankList = exports.networkHashrateInfo = exports.test = exports.withdraw_ETH = exports.harvestET = exports.remove = exports.stake = exports.withdrawNodeReward = exports.withdrawBindReward = exports.API_BindEx = exports.buy = exports.homeData2 = exports.homeData = exports.getCurrentRecord = exports.farmingInfo = exports.getNodeInfo = exports.queryInvite = exports.GetIntroducerBind = exports.getApproveTokens = exports.getAllowance = exports.getTokenSymbol = exports.rankList = exports.tokenDic = exports.isETHAddress = exports.approveToken = exports.getBalance = exports.connect = exports.logout = void 0;
const lib_const_1 = require("./lib_const");
const lib_abi_1 = require("./lib_abi");
const lib_utils_1 = require("./lib.utils");
exports.logout = lib_utils_1.logout;
exports.connect = lib_utils_1.connect;
exports.getBalance = lib_utils_1.getBalance;
exports.approveToken = lib_utils_1.approveToken;
exports.isETHAddress = lib_utils_1.isETHAddress;
/**
 * 获取symbol
 * @param token_address
 * @returns
 */
function getTokenSymbol(token_address) {
    let symbol = lib_utils_1.findToken(lib_const_1.tokenAddres[lib_const_1.userInfo.chainID], token_address);
    return symbol || "not know";
}
exports.getTokenSymbol = getTokenSymbol;
/**
 * 获取授权值   type  buy  //币的名字
 * @param token_address
 * @param type
 * @returns
 */
async function getAllowance(token_address, type) {
    let destina_address = "";
    if (type === "USDT") {
        destina_address = lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].exchangeToken;
    }
    else if (type === "ETHST") {
        destina_address = lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining;
    }
    else {
        destina_address = lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining;
    }
    return await lib_utils_1.getAllowance(token_address, destina_address);
}
exports.getAllowance = getAllowance;
/**
 * 获得approvetoken address
 * @param token_symbol
 * @returns
 */
function getApproveTokens(token_symbol) {
    return lib_const_1.tokenAddres[lib_const_1.userInfo.chainID][token_symbol];
}
exports.getApproveTokens = getApproveTokens;
/**
 * 是否绑定上级
 * @returns
 */
async function GetIntroducerBind() {
    let recommendContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.RECOMMEND, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].recommend);
    let res = await recommendContract.methods.GetIntroducerBind(lib_const_1.userInfo.account).call();
    if (res) {
        let address = await recommendContract.methods.GetIntroducer(lib_const_1.userInfo.account).call();
        return address;
    }
    else {
        return "";
    }
}
exports.GetIntroducerBind = GetIntroducerBind;
/**
 * 奖励页面
 * @returns
 */
async function queryInvite() {
    let etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
    let inviteInfo = await etQueryContract.methods.queryInvite(lib_const_1.userInfo.account).call();
    return {
        data: {
            firstLevelCount: inviteInfo.firstLevelCount,
            firstLevelAmount: lib_utils_1.convertBigNumberToNormal(inviteInfo.firstLevelAmount, 18),
            secondLevelCount: inviteInfo.secondLevelCount,
            secondLevelAmount: lib_utils_1.convertBigNumberToNormal(inviteInfo.secondLevelAmount, 18),
            reward: lib_utils_1.convertBigNumberToNormal(inviteInfo.reward, 18),
        },
    };
}
exports.queryInvite = queryInvite;
/*
 *totalContribution  贡献价值总数
 *totalvalue         当前奖池总金额
 *amount             自己的贡献值
 *reward             自己的待领取收益
 */
async function getNodeInfo() {
    let nodeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.NODEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].nodeMining);
    let contributionTotal = await nodeMiningContract.methods.Contribution_Total().call();
    let user = await nodeMiningContract.methods.getUserInfo(lib_const_1.userInfo.account).call();
    let etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
    let ETReward = await etQueryContract.methods.getNodeReward().call();
    return {
        data: {
            totalvalue: lib_utils_1.convertBigNumberToNormal(ETReward, 18),
            totalContribution: lib_utils_1.convertBigNumberToNormal(contributionTotal, 18),
            amount: lib_utils_1.convertBigNumberToNormal(user.amount, 18),
            reward: lib_utils_1.convertBigNumberToNormal(user.reward, 18),
        },
    };
}
exports.getNodeInfo = getNodeInfo;
/**
 * farming页面信息
 * @returns
 */
async function farmingInfo() {
    let etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
    let EthstPoolInfo = await etQueryContract.methods.queryEthstPool(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].WETH, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call();
    let totalAmount = lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18);
    let ET_DailyOutput = lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ET_DailyOutput, 18);
    let ETH_DailyOutput = lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETH_DailyOutput, 18);
    let etPrice = +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ET_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ET_reserveB, 18);
    let ethPrice = +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETH_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETH_reserveB, 18);
    let ethstPrice = +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveB, 18);
    let EthstPoolApy = calculateETApy(+ET_DailyOutput, etPrice, +ETH_DailyOutput, ethPrice, +totalAmount, ethstPrice);
    let ETHSTUSDTPoolInfo = await etQueryContract.methods.queryLpPool(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].ETHST, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call();
    let totalAmount0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.totalAmount, 18);
    let lpTotal0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lpTotal, 18);
    let ET_DailyOutput0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.dailyOutput, 18);
    let lp_reserveB0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);
    let etPrice0 = +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveB, 18);
    let ETHSTUSDTPoolApy = calculateLPApy(+ET_DailyOutput0, etPrice0, +lp_reserveB0, +totalAmount0, +lpTotal0);
    let lpPrice0 = +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);
    let ETUSDTPoolInfo = await etQueryContract.methods.queryLpPool(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].ET, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call();
    let totalAmount1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.totalAmount, 18);
    let lpTotal1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lpTotal, 18);
    let ET_DailyOutput1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.dailyOutput, 18);
    let lp_reserveB1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveB, 18);
    let etPrice1 = +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.ET_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.ET_reserveB, 18);
    let ETUSDTPoolApy = calculateLPApy(+ET_DailyOutput1, etPrice1, +lp_reserveB1, +totalAmount1, +lpTotal1);
    let lpPrice1 = +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveB, 18);
    return {
        data: {
            ETHPrice: ethPrice,
            ETHSTLockAmount: lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18),
            ETHST: {
                totalAmount: +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18) * ethstPrice,
                userAmount: lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.userAmount, 18),
                ethIncome: lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ethIncome, 18),
                ethTotalIncome: lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ethTotalIncome, 18),
                etIncome: lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.etIncome, 18),
                etTotalIncome: lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.etTotalIncome, 18),
                apy: EthstPoolApy,
            },
            ETHSTUSDT: {
                totalAmount: +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.totalAmount, 18) * lpPrice0,
                userAmount: lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.userAmount, 18),
                etIncome: lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.etIncome, 18),
                etTotalIncome: lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.etTotalIncome, 18),
                apy: ETHSTUSDTPoolApy,
            },
            ETUSDT: {
                totalAmount: +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.totalAmount, 18) * lpPrice1,
                userAmount: lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.userAmount, 18),
                etIncome: lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.etIncome, 18),
                etTotalIncome: lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.etTotalIncome, 18),
                apy: ETUSDTPoolApy,
            },
        },
    };
}
exports.farmingInfo = farmingInfo;
//et pool apy = ((ET单日产量 * 价格 * 365) + (ETH单日产量 * 价格 * 365)) /( totalAmount * ETHST价格)
function calculateETApy(ETDailyOutPut, etPrice, ETHDailyOutPut, ethPrice, totalAmount, ethstPrice) {
    return ((ETDailyOutPut * etPrice * 365 + ETHDailyOutPut * ethPrice * 365) / (totalAmount * ethstPrice));
}
//lp apy = (lp ET单日产量 * ET 价格 * 365) / ((lp_reserveB * 2 / lpTotal) * totalAmount)
function calculateLPApy(ETDailyOutPut, etPrice, lp_reserveB, totalAmount, lpTotal) {
    return ((ETDailyOutPut * etPrice * 365) / (((lp_reserveB * 2) / lpTotal) * totalAmount));
}
/**
 * 获取信息
 * @returns
 */
async function getCurrentRecord() {
    let etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
    let ETHSTTotal = await etQueryContract.methods.queryETHSTTotal().call();
    return {
        data: {
            total: lib_utils_1.convertBigNumberToNormal(ETHSTTotal.total, 18),
            sellTotal: lib_utils_1.convertBigNumberToNormal(ETHSTTotal.sellTotal, 18),
            buyTotal: lib_utils_1.convertBigNumberToNormal(ETHSTTotal.buyTotal, 18),
        },
    };
}
exports.getCurrentRecord = getCurrentRecord;
/**
 * 首页
 * @returns
 */
async function homeData() {
    let etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
    let homeData = await etQueryContract.methods.queryHomeData(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].ET, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].WETH, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call();
    return {
        data: {
            ETHSTprice: +lib_utils_1.convertBigNumberToNormal(homeData.ETHST_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(homeData.ETHST_reserveB, 18),
            ETprice: +lib_utils_1.convertBigNumberToNormal(homeData.ET_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(homeData.ET_reserveB, 18),
            network: {
                ETHST_total: lib_utils_1.convertBigNumberToNormal(homeData.ETHST_total, 18),
                ETHST_circulation: lib_utils_1.convertBigNumberToNormal(homeData.ETHST_circulation, 18),
                ET_total: lib_utils_1.convertBigNumberToNormal(homeData.ET_total, 18),
                ET_circulation: lib_utils_1.convertBigNumberToNormal(homeData.ET_circulation, 18),
                ETH_release: lib_utils_1.convertBigNumberToNormal(homeData.ETH_release, 18),
            },
            my: {
                ETHST_balance: lib_utils_1.convertBigNumberToNormal(homeData.ETHST_balance, 18),
                ETHST_pledge: lib_utils_1.convertBigNumberToNormal(homeData.ETHST_pledge, 18),
                ET_balance: lib_utils_1.convertBigNumberToNormal(homeData.ET_balance, 18),
                ETH_user_release: lib_utils_1.convertBigNumberToNormal(homeData.ETH_user_release, 18),
            },
        },
    };
}
exports.homeData = homeData;
/**
 * 信息
 * @returns
 */
async function homeData2() {
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
exports.homeData2 = homeData2;
/**
 * 买ETHST
 * @param _amount
 * @param husdEthstRatio
 * @param id
 * @param callback
 */
async function buy(_amount, husdEthstRatio, id, callback) {
    let exchangeTokenContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.EXCHANGETOKEN, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].exchangeToken);
    let amount = lib_utils_1.mul(_amount, husdEthstRatio);
    let bigAmount = lib_utils_1.convertNormalToBigNumber(amount, await lib_utils_1.getDecimal(getApproveTokens('USDT')));
    lib_utils_1.executeContract(exchangeTokenContract, "buy", 0, [bigAmount, id], callback);
}
exports.buy = buy;
/**
 * 提现
 * @param address
 * @param callback
 */
function API_BindEx(address, callback) {
    let recommendContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.RECOMMEND, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].recommend);
    lib_utils_1.executeContract(recommendContract, "API_BindEx", 0, [address], callback);
}
exports.API_BindEx = API_BindEx;
/**
 * 提取邀请奖励
 * @param callback
 */
function withdrawBindReward(callback) {
    let InviteRewardContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.INVITEREWARD, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].inviteReward);
    lib_utils_1.executeContract(InviteRewardContract, "withdraw", 0, [], callback);
}
exports.withdrawBindReward = withdrawBindReward;
/**
 * 提取节点奖励
 * @param callback
 */
function withdrawNodeReward(callback) {
    let nodeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.NODEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].nodeMining);
    lib_utils_1.executeContract(nodeMiningContract, "withdraw", 0, [], callback);
}
exports.withdrawNodeReward = withdrawNodeReward;
/**
 * 质押ETHST
 * @param type
 * @param amount
 * @param callback
 */
function stake(type, amount, callback) {
    let bigAmount = lib_utils_1.convertNormalToBigNumber(amount, 18);
    if (type === "ETHST") {
        let pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
        lib_utils_1.executeContract(pledgeMiningContract, "stakeEthSt", 0, [bigAmount], callback);
    }
    else if (type === "ETHSTUSDT") {
        let lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "stackLp", 0, ['0', bigAmount], callback);
    }
    else {
        let lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "stackLp", 0, ['1', bigAmount], callback);
    }
}
exports.stake = stake;
/**
 * 移除ETHST
 * @param type
 * @param amount
 * @param callback
 */
function remove(type, amount, callback) {
    let bigAmount = lib_utils_1.convertNormalToBigNumber(amount, 18);
    if (type === "ETHST") {
        let pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
        lib_utils_1.executeContract(pledgeMiningContract, "removeEthSt", 0, [bigAmount], callback);
    }
    else if (type === "ETHSTUSDT") {
        let lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "removeLp", 0, ["0", bigAmount], callback);
    }
    else {
        let lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "removeLp", 0, ["1", bigAmount], callback);
    }
}
exports.remove = remove;
/**
 * 收取et
 * @param type
 * @param callback
 */
function harvestET(type, callback) {
    if (type == "ETHST") {
        let pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
        lib_utils_1.executeContract(pledgeMiningContract, "withdraw_ET", 0, [], callback);
    }
    else if (type === "ETHSTUSDT") {
        let lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "withdrawIncome", 0, ["0"], callback);
    }
    else {
        let lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "withdrawIncome", 0, ["1"], callback);
    }
}
exports.harvestET = harvestET;
/**
 * 提取eth
 * @param callback
 */
function withdraw_ETH(callback) {
    let pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
    lib_utils_1.executeContract(pledgeMiningContract, "withdraw_ETH", 0, [], callback);
}
exports.withdraw_ETH = withdraw_ETH;
/**
 * test
 * @param callback
 */
async function test(callback) {
    let tokenContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ERC20, "0xae9269f27437f0fcbc232d39ec814844a51d6b8f");
    let bigAmount = lib_utils_1.convertNormalToBigNumber("500000000000", await lib_utils_1.getDecimal("0xae9269f27437f0fcbc232d39ec814844a51d6b8f"));
    lib_utils_1.executeContract(tokenContract, "approve", 0, ["0xA94507E3bd5e3Cd414b37456ba716A92F4877d6e", bigAmount], callback);
}
exports.test = test;
//----------------------------------------服务器信息-----------------------------------------------------------
/**
 * 拿全网算力
 * @returns
 */
async function networkHashrateInfo() {
    return fetch("https://api.ethst.io/api/v1/pool/v1/currency/stats?currency=ETH", { method: "get" }).then((response) => {
        return response.json();
    });
}
exports.networkHashrateInfo = networkHashrateInfo;
/**
 * 拿贡献榜单
 * @returns
 */
function getRankList() {
    return exports.rankList;
}
exports.getRankList = getRankList;
/**
 * 拿贡献榜单预先
 * @returns
 */
async function getRankListBefore() {
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
        exports.rankList = {
            data: nodeMiningStakes.map((item) => {
                return Object.assign(Object.assign({}, item), { amount: lib_utils_1.convertBigNumberToNormal(item.amount, 18) });
            }),
        };
    })
        .catch(() => {
        exports.rankList = { data: [] };
    });
}
exports.getRankListBefore = getRankListBefore;
//# sourceMappingURL=index.js.map