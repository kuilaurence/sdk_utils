"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRankListBefore = exports.getRankList = exports.networkHashrateInfo = exports.test = exports.withdraw_ETH = exports.harvestET = exports.remove = exports.stake = exports.withdrawNodeReward = exports.withdrawBindReward = exports.API_BindEx = exports.buy = exports.homeData2 = exports.homeData = exports.getCurrentRecord = exports.farmingInfo = exports.getNodeInfo = exports.queryInvite = exports.GetIntroducerBind = exports.getApproveTokens = exports.getAllowance = exports.getTokenSymbol = exports.rankList = exports.tokenDic = exports.isETHAddress = exports.approveToken = exports.getBalance = exports.connect = exports.logout = void 0;
var lib_const_1 = require("./lib_const");
var lib_abi_1 = require("./lib_abi");
var lib_utils_1 = require("./lib.utils");
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
    var symbol = lib_utils_1.findToken(lib_const_1.tokenAddres[lib_const_1.userInfo.chainID], token_address);
    return symbol || "not know";
}
exports.getTokenSymbol = getTokenSymbol;
/**
 * 获取授权值   type  buy  //币的名字
 * @param token_address
 * @param type
 * @returns
 */
function getAllowance(token_address, type) {
    return __awaiter(this, void 0, void 0, function () {
        var destina_address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    destina_address = "";
                    if (type === "USDT") {
                        destina_address = lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].exchangeToken;
                    }
                    else if (type === "ETHST") {
                        destina_address = lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining;
                    }
                    else {
                        destina_address = lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining;
                    }
                    return [4 /*yield*/, lib_utils_1.getAllowance(token_address, destina_address)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
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
function GetIntroducerBind() {
    return __awaiter(this, void 0, void 0, function () {
        var recommendContract, res, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    recommendContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.RECOMMEND, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].recommend);
                    return [4 /*yield*/, recommendContract.methods.GetIntroducerBind(lib_const_1.userInfo.account).call()];
                case 1:
                    res = _a.sent();
                    if (!res) return [3 /*break*/, 3];
                    return [4 /*yield*/, recommendContract.methods.GetIntroducer(lib_const_1.userInfo.account).call()];
                case 2:
                    address = _a.sent();
                    return [2 /*return*/, address];
                case 3: return [2 /*return*/, ""];
            }
        });
    });
}
exports.GetIntroducerBind = GetIntroducerBind;
/**
 * 奖励页面
 * @returns
 */
function queryInvite() {
    return __awaiter(this, void 0, void 0, function () {
        var etQueryContract, inviteInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
                    return [4 /*yield*/, etQueryContract.methods.queryInvite(lib_const_1.userInfo.account).call()];
                case 1:
                    inviteInfo = _a.sent();
                    return [2 /*return*/, {
                            data: {
                                firstLevelCount: inviteInfo.firstLevelCount,
                                firstLevelAmount: lib_utils_1.convertBigNumberToNormal(inviteInfo.firstLevelAmount, 18),
                                secondLevelCount: inviteInfo.secondLevelCount,
                                secondLevelAmount: lib_utils_1.convertBigNumberToNormal(inviteInfo.secondLevelAmount, 18),
                                reward: lib_utils_1.convertBigNumberToNormal(inviteInfo.reward, 18),
                            },
                        }];
            }
        });
    });
}
exports.queryInvite = queryInvite;
/*
 *totalContribution  贡献价值总数
 *totalvalue         当前奖池总金额
 *amount             自己的贡献值
 *reward             自己的待领取收益
 */
function getNodeInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var nodeMiningContract, contributionTotal, user, etQueryContract, ETReward;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nodeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.NODEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].nodeMining);
                    return [4 /*yield*/, nodeMiningContract.methods.Contribution_Total().call()];
                case 1:
                    contributionTotal = _a.sent();
                    return [4 /*yield*/, nodeMiningContract.methods.getUserInfo(lib_const_1.userInfo.account).call()];
                case 2:
                    user = _a.sent();
                    etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
                    return [4 /*yield*/, etQueryContract.methods.getNodeReward().call()];
                case 3:
                    ETReward = _a.sent();
                    return [2 /*return*/, {
                            data: {
                                totalvalue: lib_utils_1.convertBigNumberToNormal(ETReward, 18),
                                totalContribution: lib_utils_1.convertBigNumberToNormal(contributionTotal, 18),
                                amount: lib_utils_1.convertBigNumberToNormal(user.amount, 18),
                                reward: lib_utils_1.convertBigNumberToNormal(user.reward, 18),
                            },
                        }];
            }
        });
    });
}
exports.getNodeInfo = getNodeInfo;
/**
 * farming页面信息
 * @returns
 */
function farmingInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var etQueryContract, EthstPoolInfo, totalAmount, ET_DailyOutput, ETH_DailyOutput, etPrice, ethPrice, ethstPrice, EthstPoolApy, ETHSTUSDTPoolInfo, totalAmount0, lpTotal0, ET_DailyOutput0, lp_reserveB0, etPrice0, ETHSTUSDTPoolApy, lpPrice0, ETUSDTPoolInfo, totalAmount1, lpTotal1, ET_DailyOutput1, lp_reserveB1, etPrice1, ETUSDTPoolApy, lpPrice1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
                    return [4 /*yield*/, etQueryContract.methods.queryEthstPool(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].WETH, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call()];
                case 1:
                    EthstPoolInfo = _a.sent();
                    totalAmount = lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.totalAmount, 18);
                    ET_DailyOutput = lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ET_DailyOutput, 18);
                    ETH_DailyOutput = lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETH_DailyOutput, 18);
                    etPrice = +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ET_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ET_reserveB, 18);
                    ethPrice = +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETH_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETH_reserveB, 18);
                    ethstPrice = +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(EthstPoolInfo.ETHST_reserveB, 18);
                    EthstPoolApy = calculateETApy(+ET_DailyOutput, etPrice, +ETH_DailyOutput, ethPrice, +totalAmount, ethstPrice);
                    return [4 /*yield*/, etQueryContract.methods.queryLpPool(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].ETHST, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call()];
                case 2:
                    ETHSTUSDTPoolInfo = _a.sent();
                    totalAmount0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.totalAmount, 18);
                    lpTotal0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lpTotal, 18);
                    ET_DailyOutput0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.dailyOutput, 18);
                    lp_reserveB0 = lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);
                    etPrice0 = +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.ET_reserveB, 18);
                    ETHSTUSDTPoolApy = calculateLPApy(+ET_DailyOutput0, etPrice0, +lp_reserveB0, +totalAmount0, +lpTotal0);
                    lpPrice0 = +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETHSTUSDTPoolInfo.lp_reserveB, 18);
                    return [4 /*yield*/, etQueryContract.methods.queryLpPool(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].ET, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call()];
                case 3:
                    ETUSDTPoolInfo = _a.sent();
                    totalAmount1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.totalAmount, 18);
                    lpTotal1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lpTotal, 18);
                    ET_DailyOutput1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.dailyOutput, 18);
                    lp_reserveB1 = lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveB, 18);
                    etPrice1 = +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.ET_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.ET_reserveB, 18);
                    ETUSDTPoolApy = calculateLPApy(+ET_DailyOutput1, etPrice1, +lp_reserveB1, +totalAmount1, +lpTotal1);
                    lpPrice1 = +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveA, 18) / +lib_utils_1.convertBigNumberToNormal(ETUSDTPoolInfo.lp_reserveB, 18);
                    return [2 /*return*/, {
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
                        }];
            }
        });
    });
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
function getCurrentRecord() {
    return __awaiter(this, void 0, void 0, function () {
        var etQueryContract, ETHSTTotal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
                    return [4 /*yield*/, etQueryContract.methods.queryETHSTTotal().call()];
                case 1:
                    ETHSTTotal = _a.sent();
                    return [2 /*return*/, {
                            data: {
                                total: lib_utils_1.convertBigNumberToNormal(ETHSTTotal.total, 18),
                                sellTotal: lib_utils_1.convertBigNumberToNormal(ETHSTTotal.sellTotal, 18),
                                buyTotal: lib_utils_1.convertBigNumberToNormal(ETHSTTotal.buyTotal, 18),
                            },
                        }];
            }
        });
    });
}
exports.getCurrentRecord = getCurrentRecord;
/**
 * 首页
 * @returns
 */
function homeData() {
    return __awaiter(this, void 0, void 0, function () {
        var etQueryContract, homeData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    etQueryContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ETQUERY, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].etQuery);
                    return [4 /*yield*/, etQueryContract.methods.queryHomeData(lib_const_1.userInfo.account, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].ET, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].WETH, lib_const_1.tokenAddres[lib_const_1.userInfo.chainID].USDT).call()];
                case 1:
                    homeData = _a.sent();
                    return [2 /*return*/, {
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
                        }];
            }
        });
    });
}
exports.homeData = homeData;
/**
 * 信息
 * @returns
 */
function homeData2() {
    return __awaiter(this, void 0, void 0, function () {
        var _homedate, _farmingInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, homeData()];
                case 1:
                    _homedate = _a.sent();
                    return [4 /*yield*/, farmingInfo()];
                case 2:
                    _farmingInfo = _a.sent();
                    return [2 /*return*/, {
                            data: {
                                ETHSTLockAmount: _farmingInfo.data.ETHSTLockAmount,
                                ETHST_total: _homedate.data.network.ETHST_total,
                                ETHPrice: _farmingInfo.data.ETHPrice,
                                ETprice: _homedate.data.ETprice,
                            },
                        }];
            }
        });
    });
}
exports.homeData2 = homeData2;
/**
 * 买ETHST
 * @param _amount
 * @param husdEthstRatio
 * @param id
 * @param callback
 */
function buy(_amount, husdEthstRatio, id, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var exchangeTokenContract, amount, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    exchangeTokenContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.EXCHANGETOKEN, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].exchangeToken);
                    amount = lib_utils_1.mul(_amount, husdEthstRatio);
                    _a = lib_utils_1.convertNormalToBigNumber;
                    _b = [amount];
                    return [4 /*yield*/, lib_utils_1.getDecimal(getApproveTokens('USDT'))];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    lib_utils_1.executeContract(exchangeTokenContract, "buy", 0, [bigAmount, id], callback);
                    return [2 /*return*/];
            }
        });
    });
}
exports.buy = buy;
/**
 * 提现
 * @param address
 * @param callback
 */
function API_BindEx(address, callback) {
    var recommendContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.RECOMMEND, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].recommend);
    lib_utils_1.executeContract(recommendContract, "API_BindEx", 0, [address], callback);
}
exports.API_BindEx = API_BindEx;
/**
 * 提取邀请奖励
 * @param callback
 */
function withdrawBindReward(callback) {
    var InviteRewardContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.INVITEREWARD, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].inviteReward);
    lib_utils_1.executeContract(InviteRewardContract, "withdraw", 0, [], callback);
}
exports.withdrawBindReward = withdrawBindReward;
/**
 * 提取节点奖励
 * @param callback
 */
function withdrawNodeReward(callback) {
    var nodeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.NODEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].nodeMining);
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
    var bigAmount = lib_utils_1.convertNormalToBigNumber(amount, 18);
    if (type === "ETHST") {
        var pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
        lib_utils_1.executeContract(pledgeMiningContract, "stakeEthSt", 0, [bigAmount], callback);
    }
    else if (type === "ETHSTUSDT") {
        var lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "stackLp", 0, ['0', bigAmount], callback);
    }
    else {
        var lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
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
    var bigAmount = lib_utils_1.convertNormalToBigNumber(amount, 18);
    if (type === "ETHST") {
        var pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
        lib_utils_1.executeContract(pledgeMiningContract, "removeEthSt", 0, [bigAmount], callback);
    }
    else if (type === "ETHSTUSDT") {
        var lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "removeLp", 0, ["0", bigAmount], callback);
    }
    else {
        var lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
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
        var pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
        lib_utils_1.executeContract(pledgeMiningContract, "withdraw_ET", 0, [], callback);
    }
    else if (type === "ETHSTUSDT") {
        var lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "withdrawIncome", 0, ["0"], callback);
    }
    else {
        var lpMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.LPMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].lpMining);
        lib_utils_1.executeContract(lpMiningContract, "withdrawIncome", 0, ["1"], callback);
    }
}
exports.harvestET = harvestET;
/**
 * 提取eth
 * @param callback
 */
function withdraw_ETH(callback) {
    var pledgeMiningContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.PLEDGEMINING, lib_const_1.ContractAddress[lib_const_1.userInfo.chainID].pledgeMining);
    lib_utils_1.executeContract(pledgeMiningContract, "withdraw_ETH", 0, [], callback);
}
exports.withdraw_ETH = withdraw_ETH;
/**
 * test
 * @param callback
 */
function test(callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new lib_utils_1.web3.eth.Contract(lib_abi_1.ERC20, "0xae9269f27437f0fcbc232d39ec814844a51d6b8f");
                    _a = lib_utils_1.convertNormalToBigNumber;
                    _b = ["500000000000"];
                    return [4 /*yield*/, lib_utils_1.getDecimal("0xae9269f27437f0fcbc232d39ec814844a51d6b8f")];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    lib_utils_1.executeContract(tokenContract, "approve", 0, ["0xA94507E3bd5e3Cd414b37456ba716A92F4877d6e", bigAmount], callback);
                    return [2 /*return*/];
            }
        });
    });
}
exports.test = test;
//----------------------------------------服务器信息-----------------------------------------------------------
/**
 * 拿全网算力
 * @returns
 */
function networkHashrateInfo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, fetch("https://api.ethst.io/api/v1/pool/v1/currency/stats?currency=ETH", { method: "get" }).then(function (response) {
                    return response.json();
                })];
        });
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
function getRankListBefore() {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = "\n    {\n        nodeMiningStakes(orderBy: amount, orderDirection: desc, first: 20) {\n          id\n          amount\n        }\n      }\n    ";
            return [2 /*return*/, fetch("https://api.ethst.io/subgraphs/name/ethst/ethst_project", {
                    method: "post",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ query: query, }),
                }).then(function (response) { return response.json(); })
                    .then(function (data) {
                    var nodeMiningStakes = data.data.nodeMiningStakes;
                    exports.rankList = {
                        data: nodeMiningStakes.map(function (item) {
                            return __assign(__assign({}, item), { amount: lib_utils_1.convertBigNumberToNormal(item.amount, 18) });
                        }),
                    };
                })
                    .catch(function () {
                    exports.rankList = { data: [] };
                })];
        });
    });
}
exports.getRankListBefore = getRankListBefore;
//# sourceMappingURL=index.js.map