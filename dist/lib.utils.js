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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import Web3 from "web3";
export var web3;
import { ERC20 } from "./lib_abi";
import walletlink from 'walletlink';
import { BigNumber } from "bignumber.js";
import { chainIdDict, userInfo } from "./lib_const";
import WalletConnectProvider from "@walletconnect/web3-provider";
BigNumber.config({ ROUNDING_MODE: 1 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
var MAXNUM = (9999 * 99999 * 100000).toString();
/**
 * 大数转常数
 * @param number 大数
 * @param decimals 精度(可选)
 * @returns string
 */
export function convertBigNumberToNormal(number, decimals) {
    if (decimals === void 0) { decimals = 18; }
    var result = new BigNumber(number).dividedBy(new BigNumber(Math.pow(10, decimals)));
    return result.toFixed(10);
}
/**
 * 常数转大数
 * @param number 常数
 * @param decimals 精度(选填)
 * @param fix 截取(选填)
 * @returns string
 */
export function convertNormalToBigNumber(number, decimals, fix) {
    if (decimals === void 0) { decimals = 18; }
    if (fix === void 0) { fix = 0; }
    return new BigNumber(number).multipliedBy(new BigNumber(Math.pow(10, decimals))).minus(fix).toFixed(0);
}
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns string
 */
export function calculatePercentage(numerator, denominator) {
    return new BigNumber(numerator)
        .dividedBy(new BigNumber(denominator))
        .toFixed();
}
/**
 * multipliedBy
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function calculateMultiplied(number1, number2) {
    return new BigNumber(number1).multipliedBy(new BigNumber(number2)).toFixed(0);
}
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function minusBigNumber(number1, number2) {
    return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(0);
}
/**
 * 加 x+y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function add(number1, number2) {
    return new BigNumber(number1).plus(new BigNumber(number2)).toFixed(10);
}
/**
 * 减 x-y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function sub(number1, number2) {
    return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(10);
}
/**
 * 乘 x*y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function mul(number1, number2) {
    return new BigNumber(number1).times(new BigNumber(number2)).toFixed(10);
}
/**
 * 除  x/y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function div(number1, number2) {
    return new BigNumber(number1).div(new BigNumber(number2)).toFixed(10);
}
/**
 * deadline
 * @param delay time
 * @returns timestemp
 */
export function getDeadLine(delay) {
    return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}
export var sleep = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
/**
 * 通过value找key
 * @param obj 对象
 * @param value value
 * @param compare 比较(可选)
 * @returns key
 */
export function findToken(obj, value, compare) {
    if (compare === void 0) { compare = function (a, b) { return a.toLowerCase() === b.toLowerCase(); }; }
    return Object.keys(obj).find(function (k) { return compare(obj[k], value); });
}
/**
 * 判断是否为以太坊地址
 * @param token_address 地址
 * @returns bool
 */
export function isETHAddress(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var code, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, web3.eth.getCode(token_address)];
                case 1:
                    code = _a.sent();
                    if (code === "0x") {
                        return [2 /*return*/, true];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * 查币的余额
 * @param token_address 币地址
 * @returns 余额 常数
 */
export function getBalance(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, balance, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20, token_address);
                    return [4 /*yield*/, tokenContract.methods.balanceOf(userInfo.account).call()];
                case 1:
                    balance = _c.sent();
                    _a = convertBigNumberToNormal;
                    _b = [balance];
                    return [4 /*yield*/, getDecimal(token_address)];
                case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            }
        });
    });
}
/**
 * 转账
 * @param token_address 币地址
 * @param to_address 收款地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export function transfer(token_address, to_address, amount, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20, token_address);
                    _a = convertNormalToBigNumber;
                    _b = [amount];
                    return [4 /*yield*/, getDecimal(token_address)];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    executeContract(tokenContract, "transfer", 0, [to_address, bigAmount], callback);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 从**转账
 * @param token_address 币的地址
 * @param from_address 出账地址
 * @param to_address 入账地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export function transferFrom(token_address, from_address, to_address, amount, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20, token_address);
                    _a = convertNormalToBigNumber;
                    _b = [amount];
                    return [4 /*yield*/, getDecimal(token_address)];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    executeContract(tokenContract, "transferFrom", 0, [from_address, to_address, bigAmount], callback);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 获取币的精度
 * @param token_address
 * @returns
 */
export function getDecimal(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, decimal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20, token_address);
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 1:
                    decimal = _a.sent();
                    return [2 /*return*/, decimal];
            }
        });
    });
}
/**
 * approve Token
 * @param token_address 币地址
 * @param destina_address 目标地址
 * @param callback 回调
 */
export function approveToken(token_address, destina_address, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20, token_address);
                    _a = convertNormalToBigNumber;
                    _b = ["500000000000"];
                    return [4 /*yield*/, getDecimal(token_address)];
                case 1:
                    bigAmount = _a.apply(void 0, _b.concat([_c.sent()]));
                    executeContract(tokenContract, "approve", 0, [destina_address, bigAmount], callback);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 获取授权额度
 * @param token_address
 * @param destina_address
 * @returns
 */
export function getAllowance(token_address, destina_address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, allowance, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20, token_address);
                    return [4 /*yield*/, tokenContract.methods.allowance(userInfo.account, destina_address).call()];
                case 1:
                    allowance = _c.sent();
                    _a = convertBigNumberToNormal;
                    _b = [allowance];
                    return [4 /*yield*/, getDecimal(token_address)];
                case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            }
        });
    });
}
/**
 * 执行合约
 * @param contract 合约实例
 * @param methodName 方法
 * @param value value
 * @param params 参数
 * @param callback 回调
 */
export function executeContract(contract, methodName, value, params, callback) {
    var _a;
    (_a = contract.methods)[methodName].apply(_a, __spreadArray([], __read(params))).send({ from: userInfo.account, value: value })
        .on("transactionHash", function (hash) {
        callback(0, hash);
    })
        .on("confirmation", function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
            callback(1, receipt.transactionHash);
        }
    })
        .on("error", function (error, message) {
        if (message && message.transactionHash) {
            callback(3, message.transactionHash);
        }
        else {
            callback(2, error.message);
        }
    });
}
var walletDisconnectTimer;
var provider = new WalletConnectProvider({
    rpc: {
        1: "https://jsonrpc.maiziqianbao.net/",
        56: 'https://bsc-dataseed.binance.org/',
    },
});
var walletLink = new walletlink({
    appName: "Multiple",
    appLogoUrl: "https://avatars.githubusercontent.com/u/23645629?s=48&v=4",
    darkMode: false
});
var coinbaseRpc = "https://jsonrpc.maiziqianbao.net/";
/**
 * 链接钱包
 * @param walletName 钱包的名字小写
 * @param callback
 * @returns
 */
export function connect(walletName, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var resMsg, _a, _ethereum, accounts, _ethereum, accounts, _b, e_2;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    resMsg = {
                        account: "",
                        chainID: 0,
                        chain: "",
                        message: "success",
                    };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 10, , 11]);
                    if (!(walletName === "walletconnect")) return [3 /*break*/, 4];
                    return [4 /*yield*/, provider.enable()];
                case 2:
                    _c.sent();
                    //@ts-ignore
                    web3 = new Web3(provider);
                    userInfo.account = provider.accounts[0];
                    _a = userInfo;
                    return [4 /*yield*/, web3.eth.getChainId()];
                case 3:
                    _a.chainID = (_c.sent());
                    resMsg.account = userInfo.account;
                    resMsg.chain = chainIdDict[userInfo.chainID];
                    resMsg.message = "success";
                    provider.on("accountsChanged", function (accounts) {
                        userInfo.account = accounts[0];
                        callback({
                            account: userInfo.account,
                            chainID: userInfo.chainID,
                            chain: chainIdDict[userInfo.chainID],
                            message: "accountsChanged",
                        });
                    });
                    provider.on("chainChanged", function (chainId) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = userInfo;
                                    return [4 /*yield*/, web3.eth.getChainId()];
                                case 1:
                                    _a.chainID = (_b.sent());
                                    callback({
                                        account: userInfo.account,
                                        chainID: userInfo.chainID,
                                        chain: chainIdDict[userInfo.chainID],
                                        message: "chainChanged",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    provider.on("disconnect", function (code, reason) {
                        if (walletDisconnectTimer !== null)
                            clearTimeout(walletDisconnectTimer);
                        walletDisconnectTimer = setTimeout(function () {
                            walletDisconnectTimer = null;
                            if (code) {
                                userInfo.account = "";
                                userInfo.chainID = 1;
                                userInfo.chain = "Ethereum";
                                callback({
                                    account: "",
                                    chainID: 1,
                                    chain: "",
                                    message: "disconnect",
                                });
                            }
                        }, 300);
                    });
                    return [3 /*break*/, 9];
                case 4:
                    if (!(walletName === "coinbasewallet")) return [3 /*break*/, 6];
                    _ethereum = walletLink.makeWeb3Provider(coinbaseRpc, 1);
                    return [4 /*yield*/, _ethereum.enable()];
                case 5:
                    accounts = _c.sent();
                    web3 = new Web3(_ethereum);
                    userInfo.account = accounts[0];
                    userInfo.chainID = 1;
                    userInfo.chain = "Ethereum";
                    resMsg.account = userInfo.account;
                    resMsg.chainID = userInfo.chainID;
                    resMsg.chain = userInfo.chain;
                    _ethereum.on("disconnect", function (code, reason) {
                        if (code) {
                            userInfo.account = "";
                            userInfo.chainID = 1;
                            userInfo.chain = "Ethereum";
                            callback({
                                account: "",
                                chainID: 1,
                                chain: "",
                                message: "disconnect",
                            });
                        }
                    });
                    return [3 /*break*/, 9];
                case 6:
                    _ethereum = window["ethereum"];
                    if (!_ethereum) {
                        resMsg.message = "Check your wallet!";
                        return [2 /*return*/, resMsg];
                    }
                    return [4 /*yield*/, _ethereum.enable()];
                case 7:
                    accounts = _c.sent();
                    web3 = new Web3(_ethereum);
                    userInfo.account = accounts[0];
                    _b = userInfo;
                    return [4 /*yield*/, web3.eth.getChainId()];
                case 8:
                    _b.chainID = (_c.sent());
                    userInfo.chain = chainIdDict[userInfo.chainID];
                    resMsg.account = userInfo.account;
                    resMsg.chainID = userInfo.chainID;
                    resMsg.chain = userInfo.chain;
                    _ethereum.on("accountsChanged", function (accounts) {
                        userInfo.account = accounts[0];
                        callback({
                            account: userInfo.account,
                            chainID: userInfo.chainID,
                            chain: chainIdDict[userInfo.chainID],
                            message: "accountsChanged",
                        });
                    });
                    _ethereum.on("chainChanged", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = userInfo;
                                    return [4 /*yield*/, web3.eth.getChainId()];
                                case 1:
                                    _a.chainID = (_b.sent());
                                    callback({
                                        account: userInfo.account,
                                        chainID: userInfo.chainID,
                                        chain: chainIdDict[userInfo.chainID],
                                        message: "chainChanged",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _c.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_2 = _c.sent();
                    resMsg.message = e_2.message;
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, resMsg];
            }
        });
    });
}
/**
 * 一键添加切换BSC/HECO智能链
 * @param chainName "BSC" | "HECO"
 * @returns "" 无返回
 */
export function addMetamaskChain(chainName) {
    return __awaiter(this, void 0, void 0, function () {
        var _ethereum, dataBSC, dataHECO, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _ethereum = window['ethereum'];
                    if (!_ethereum || !_ethereum.isMetaMask) {
                        return [2 /*return*/];
                    }
                    dataBSC = [{
                            chainId: '0x38',
                            chainName: 'Binance Smart Chain',
                            nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18
                            },
                            rpcUrls: ['https://bsc-dataseed.binance.org/'],
                            blockExplorerUrls: ['https://bscscan.com/'],
                        }];
                    dataHECO = [{
                            chainId: '0x80',
                            chainName: 'HECO Mainnet',
                            nativeCurrency: {
                                name: 'HT',
                                symbol: 'HT',
                                decimals: 18
                            },
                            rpcUrls: ['https://http-mainnet.hecochain.com/'],
                            blockExplorerUrls: ['https://hecoinfo.com/'],
                        }];
                    data = chainName == "BSC" ? dataBSC : dataHECO;
                    return [4 /*yield*/, _ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 退出
 * @returns
 */
export function logout() {
    userInfo.account = "";
    userInfo.chainID = 1;
    userInfo.chain = "Ethereum";
    provider.disconnect();
    walletLink.disconnect();
    return {
        account: "",
        chainID: 1,
        chain: "",
        message: "logout",
    };
}
//全局log
var isTrace = false;
/**
 * 删除数字末尾多余的0
 * @param str
 * @returns 字符串型的数字
 */
export function toPrecision(str) {
    if (!Boolean(str))
        return '0';
    if (!(/^[0-9.]+$/g.test(str)))
        return '0';
    while (str.includes(".") && (str.endsWith('.') || str.endsWith('0'))) {
        str = str.slice(0, -1);
    }
    return str;
}
var Trace = /** @class */ (function () {
    function Trace() {
    }
    /**
     *设置log的开关
     * @param b bool
     */
    Trace.setTraceShow = function (b) {
        isTrace = b;
    };
    /**
     * log的内容
     * @param message log提示
     * @param optionalParams log内容
     */
    Trace.trace = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (isTrace) {
            console.log.apply(console, __spreadArray([message], __read(optionalParams)));
        }
    };
    return Trace;
}());
export { Trace };
//# sourceMappingURL=lib.utils.js.map