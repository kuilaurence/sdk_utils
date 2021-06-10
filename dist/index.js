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
import { userInfo, tokenAddres, ContractAddress } from "./lib_const";
import { ERC20, MULBANK, MULWORK, UNISWAPV3POOL, UNISWAPV3STRATEGY } from "./lib_abi";
import { web3, Trace, findToken, getDecimal, convertBigNumberToNormal, convertNormalToBigNumber, executeContract, addMetamaskChain as _addMetamaskChain, toPrecision as _toPrecision, logout as _logout, sleep as _sleep, connect as _connect, getBalance as _getBalance, getAllowance as _getAllowance, approveToken as _approveToken, isETHAddress as _isETHAddress } from "./lib.utils";
export var T = Trace;
export var sleep = _sleep;
export var logout = _logout;
export var connect = _connect;
export var getBalance = _getBalance;
export var toPrecision = _toPrecision;
export var isETHAddress = _isETHAddress;
export var addMetamaskChain = _addMetamaskChain;
/**
 * 根据token symbol获取address
 * @param token_symbol
 * @returns
 */
export function getTokenAddress(token_symbol) {
    return tokenAddres[userInfo.chainID][token_symbol];
}
/**
 * 根据token address,获取symbol
 * @param token_address
 * @returns
 */
export function getTokenSymbol(token_address) {
    var symbol = findToken(tokenAddres[userInfo.chainID], token_address);
    return symbol || "unknow";
}
/**
 * 获取授权值
 * @param token_address
 * @returns
 */
export function getAllowance(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var destina_address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    destina_address = ContractAddress[userInfo.chainID].mulBank;
                    return [4 /*yield*/, _getAllowance(token_address, destina_address)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 池子存的数量
 * @param token_address
 * @returns
 */
export function poolInfo(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var decimal, mulBankContract, _totalShare, totalShare, res, tokenContract, _shareTokenTotalSupply, shareTokenTotalSupply, shareTokenBalance, reward;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDecimal(token_address)];
                case 1:
                    decimal = _a.sent();
                    mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
                    return [4 /*yield*/, mulBankContract.methods.getTotalShare(token_address).call()];
                case 2:
                    _totalShare = _a.sent();
                    totalShare = convertBigNumberToNormal(_totalShare, decimal);
                    return [4 /*yield*/, mulBankContract.methods.poolInfo(token_address).call()];
                case 3:
                    res = _a.sent();
                    tokenContract = new web3.eth.Contract(ERC20, res.shareToken);
                    return [4 /*yield*/, tokenContract.methods.totalSupply().call()];
                case 4:
                    _shareTokenTotalSupply = _a.sent();
                    shareTokenTotalSupply = convertBigNumberToNormal(_shareTokenTotalSupply, decimal);
                    return [4 /*yield*/, getBalance(res.shareToken)];
                case 5:
                    shareTokenBalance = _a.sent();
                    reward = '0';
                    if (+shareTokenTotalSupply <= 0) {
                        reward = '0';
                    }
                    else {
                        reward = (+shareTokenBalance - (+shareTokenBalance * +totalShare / +shareTokenTotalSupply)).toFixed(8);
                    }
                    return [2 /*return*/, {
                            data: {
                                supplyToken: res.supplyToken,
                                shareToken: res.shareToken,
                                shareTokenBalance: shareTokenBalance,
                                reward: reward,
                                totalBorrow: convertBigNumberToNormal(res.totalBorrow, decimal),
                                loss: convertBigNumberToNormal(res.loss, decimal),
                                totalDeposit: convertBigNumberToNormal(res.totalDeposit, decimal),
                            }
                        }];
            }
        });
    });
}
/**
 * 投资前查询创建的账户信息
 * @returns
 */
export function workers() {
    return __awaiter(this, void 0, void 0, function () {
        var mulWorkContract, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
                    return [4 /*yield*/, mulWorkContract.methods.workers(userInfo.account).call()];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, {
                            data: {
                                createTime: res.createTime,
                                created: res.created,
                                lastWorkTime: res.lastWorkTime,
                                power: res.power,
                                totalProfit: res.totalProfit,
                                workerId: res.workerId
                            }
                        }];
            }
        });
    });
}
/**
 *
 * @param token0_address
 * @param token1_address
 * @param ratio 价格
 * @returns
 */
function getTick(token0_address, token1_address, ratio) {
    return __awaiter(this, void 0, void 0, function () {
        var temp, val0, val1, ans;
        return __generator(this, function (_a) {
            if (Number(token0_address) > Number(token1_address)) {
                temp = token0_address;
                token0_address = token1_address;
                token1_address = temp;
            }
            val0 = Math.log2(ratio);
            val1 = Math.log2(1.0001);
            ans = Math.floor(val0 / val1);
            if (val0 > 0) {
                return [2 /*return*/, (ans - ans % 60).toString()];
            }
            else {
                return [2 /*return*/, (ans - (200 - Math.abs(ans) % 60)).toString()];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 获取池子的价格（暂时只有 usdt/btc）
 * @param token0_address
 * @param token1_address
 * @returns
 */
export function getSqrtPrice(token0_address, token1_address) {
    return __awaiter(this, void 0, void 0, function () {
        var temp, v3poolContract, res, tick;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (Number(token0_address) > Number(token1_address)) {
                        temp = token0_address;
                        token0_address = token1_address;
                        token1_address = temp;
                    }
                    v3poolContract = new web3.eth.Contract(UNISWAPV3POOL, ContractAddress[userInfo.chainID].v3pool);
                    return [4 /*yield*/, v3poolContract.methods.slot0().call()];
                case 1:
                    res = _a.sent();
                    tick = res.tick;
                    return [2 /*return*/, Math.pow(res.sqrtPriceX96 / (Math.pow(2, 96)), 2)];
            }
        });
    });
}
/**
 * 获取投资最大值
 * @param token0_address
 * @param token1_address
 * @returns
 */
export function getRemainQuota(token0_address, token1_address) {
    return __awaiter(this, void 0, void 0, function () {
        var mulWorkContract, remain0, remain1, _a, _b, _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
                    return [4 /*yield*/, mulWorkContract.methods.getRemainQuota(userInfo.account, token0_address).call()];
                case 1:
                    remain0 = _g.sent();
                    return [4 /*yield*/, mulWorkContract.methods.getRemainQuota(userInfo.account, token1_address).call()];
                case 2:
                    remain1 = _g.sent();
                    _e = {};
                    _f = {
                        token0: token0_address,
                        symbol0: getTokenSymbol(token0_address)
                    };
                    _a = convertBigNumberToNormal;
                    _b = [remain0];
                    return [4 /*yield*/, getDecimal(token0_address)];
                case 3:
                    _f.remain0 = _a.apply(void 0, _b.concat([_g.sent()])),
                        _f.token1 = token1_address,
                        _f.symbol1 = getTokenSymbol(token1_address);
                    _c = convertBigNumberToNormal;
                    _d = [remain1];
                    return [4 /*yield*/, getDecimal(token1_address)];
                case 4: return [2 /*return*/, (_e.data = (_f.remain1 = _c.apply(void 0, _d.concat([_g.sent()])),
                        _f),
                        _e)];
            }
        });
    });
}
/**
 *算出对应token的量
 * @param type
 * @param token0_address
 * @param token1_address
 * @param priceLower
 * @param priceCurrent
 * @param priceUpper
 * @param amount
 * @returns
 */
export function getTokenValue(type, token0_address, token1_address, priceLower, priceCurrent, priceUpper, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var resultAmount, tickLower, tickCurrent, tickUpper;
        return __generator(this, function (_a) {
            resultAmount = 0;
            tickLower = +getTick(token0_address, token1_address, priceLower);
            tickCurrent = +getTick(token0_address, token1_address, priceCurrent);
            tickUpper = +getTick(token0_address, token1_address, priceUpper);
            if (type === "token0") { //usdt
                resultAmount = amount / (Math.sqrt(tickLower) - Math.sqrt(tickCurrent));
            }
            else { //eth
                resultAmount = amount * ((Math.sqrt(tickCurrent) * Math.sqrt(tickUpper)) / ((Math.sqrt(tickUpper) - Math.sqrt(tickCurrent))));
            }
            return [2 /*return*/, { resultAmount: resultAmount }];
        });
    });
}
/**
 * 拿tick上的价格
 * @param token0_address
 * @param token1_address
 * @param price
 * @returns
 */
export function getCloseToTickPrice(token0_address, token1_address, price) {
    var tick = +getTick(token0_address, token1_address, price);
    return Math.pow(2, (tick * Math.log2(1.0001)));
}
//---------------------------------------------------上查下操作------------------------------------------------------
/**
 * 对token授权
 * @param token_address
 * @param callback
 */
export function approveToken(token_address, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var destina_address;
        return __generator(this, function (_a) {
            destina_address = ContractAddress[userInfo.chainID].mulBank;
            _approveToken(token_address, destina_address, callback);
            return [2 /*return*/];
        });
    });
}
/**
 * deposit买入
 * @param token_address
 * @param amount
 * @param callback
 */
export function deposit(token_address, amount, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var mulBankContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
                    _a = convertNormalToBigNumber;
                    _b = [amount];
                    return [4 /*yield*/, getDecimal(token_address)];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    executeContract(mulBankContract, "deposit", 0, [token_address, bigAmount], callback);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * withdraw 提出
 * @param token_address
 * @param amount
 * @param callback
 */
export function withdraw(token_address, amount, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var mulBankContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
                    _a = convertNormalToBigNumber;
                    _b = [amount];
                    return [4 /*yield*/, getDecimal(token_address)];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    executeContract(mulBankContract, "withdraw", 0, [token_address, bigAmount], callback);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 投资
 * @param token0_address
 * @param token1_address
 * @param fee
 * @param amount0
 * @param amount1
 * @param leftPrice
 * @param rightPrice
 * @param callback
 */
export function invest(token0_address, token1_address, fee, amount0, amount1, leftPrice, rightPrice, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var v3strategyContract, tickLower, tickUpper, bigAmount0, _a, _b, bigAmount1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
                    return [4 /*yield*/, getTick(token0_address, token1_address, +leftPrice)];
                case 1:
                    tickLower = _e.sent();
                    return [4 /*yield*/, getTick(token0_address, token1_address, +rightPrice)];
                case 2:
                    tickUpper = _e.sent();
                    _a = convertNormalToBigNumber;
                    _b = [amount0];
                    return [4 /*yield*/, getDecimal(token0_address)];
                case 3:
                    bigAmount0 = _a.apply(void 0, _b.concat([_e.sent()]));
                    _c = convertNormalToBigNumber;
                    _d = [amount1];
                    return [4 /*yield*/, getDecimal(token1_address)];
                case 4:
                    bigAmount1 = _c.apply(void 0, _d.concat([_e.sent()]));
                    executeContract(v3strategyContract, "invest", 0, [
                        {
                            "token0": token0_address,
                            "token1": token1_address,
                            "fee": fee,
                            "amount0Desired": bigAmount0,
                            "amount1Desired": bigAmount1,
                            "tickLower": tickLower,
                            "tickUpper": tickUpper
                        }
                    ], callback);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 撤资
 * @param id
 * @param callback
 */
export function divest(id, callback) {
    var v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
    executeContract(v3strategyContract, "divest", 0, [id], callback);
}
/**
 * 创建账号（投资前先创建）
 * @param callback
 */
export function createAccount(callback) {
    var mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
    executeContract(mulWorkContract, "createAccount", 0, [], callback);
}
/**
 * test
 * @param callback
 */
export function test(callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20, "0xae9269f27437f0fcbc232d39ec814844a51d6b8f");
                    _a = convertNormalToBigNumber;
                    _b = ["500000000000"];
                    return [4 /*yield*/, getDecimal("0xae9269f27437f0fcbc232d39ec814844a51d6b8f")];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    executeContract(tokenContract, "approve", 0, ["0xA94507E3bd5e3Cd414b37456ba716A92F4877d6e", bigAmount], callback);
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=index.js.map