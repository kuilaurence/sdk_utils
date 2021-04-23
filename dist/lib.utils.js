"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.connect = exports.executeContract = exports.getAllowance = exports.approveToken = exports.getDecimal = exports.transferFrom = exports.transfer = exports.getBalance = exports.isETHAddress = exports.findToken = exports.getDeadLine = exports.div = exports.mul = exports.sub = exports.add = exports.minusBigNumber = exports.calculateMultiplied = exports.calculatePercentage = exports.convertNormalToBigNumber = exports.convertBigNumberToNormal = exports.web3 = void 0;
var web3_1 = __importDefault(require("web3"));
var lib_abi_1 = require("./lib_abi");
var bignumber_js_1 = require("bignumber.js");
var lib_const_1 = require("./lib_const");
bignumber_js_1.BigNumber.config({ ROUNDING_MODE: 1 }); //下取整
bignumber_js_1.BigNumber.config({ EXPONENTIAL_AT: 1e+9 }); //消除科学计数法
/**
 * 大数转常数
 * @param number 大数
 * @param decimals 精度(可选)
 * @returns string
 */
function convertBigNumberToNormal(number, decimals) {
    if (decimals === void 0) { decimals = 18; }
    var result = new bignumber_js_1.BigNumber(number).dividedBy(new bignumber_js_1.BigNumber(Math.pow(10, decimals)));
    return result.toFixed(10);
}
exports.convertBigNumberToNormal = convertBigNumberToNormal;
/**
 * 常数转大数
 * @param number 常数
 * @param decimals 精度(选填)
 * @param fix 截取(选填)
 * @returns string
 */
function convertNormalToBigNumber(number, decimals, fix) {
    if (decimals === void 0) { decimals = 18; }
    if (fix === void 0) { fix = 0; }
    return new bignumber_js_1.BigNumber(number).multipliedBy(new bignumber_js_1.BigNumber(Math.pow(10, decimals))).minus(fix).toFixed(0);
}
exports.convertNormalToBigNumber = convertNormalToBigNumber;
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns string
 */
function calculatePercentage(numerator, denominator) {
    return new bignumber_js_1.BigNumber(numerator)
        .dividedBy(new bignumber_js_1.BigNumber(denominator))
        .toFixed();
}
exports.calculatePercentage = calculatePercentage;
/**
 * multipliedBy
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function calculateMultiplied(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).multipliedBy(new bignumber_js_1.BigNumber(number2)).toFixed(0);
}
exports.calculateMultiplied = calculateMultiplied;
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function minusBigNumber(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).minus(new bignumber_js_1.BigNumber(number2)).toFixed(0);
}
exports.minusBigNumber = minusBigNumber;
/**
 * 加 x+y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function add(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).plus(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.add = add;
/**
 * 减 x-y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function sub(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).minus(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.sub = sub;
/**
 * 乘 x*y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function mul(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).times(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.mul = mul;
/**
 * 除  x/y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function div(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).div(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.div = div;
/**
 * deadline
 * @param delay time
 * @returns timestemp
 */
function getDeadLine(delay) {
    return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}
exports.getDeadLine = getDeadLine;
/**
 * 通过value找key
 * @param obj 对象
 * @param value value
 * @param compare 比较(可选)
 * @returns key
 */
function findToken(obj, value, compare) {
    if (compare === void 0) { compare = function (a, b) { return a === b; }; }
    return Object.keys(obj).find(function (k) { return compare(obj[k], value); });
}
exports.findToken = findToken;
/**
 * 判断是否为以太坊地址
 * @param token_address 地址
 * @returns bool
 */
function isETHAddress(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var code, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.web3.eth.getCode(token_address)];
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
exports.isETHAddress = isETHAddress;
/**
 * 查币的余额
 * @param token_address 币地址
 * @returns 余额 常数
 */
function getBalance(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, balance, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
                    return [4 /*yield*/, tokenContract.methods.balanceOf(lib_const_1.userInfo.account).call()];
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
exports.getBalance = getBalance;
/**
 * 转账
 * @param token_address 币地址
 * @param to_address 收款地址
 * @param amount 数量 常数
 * @param callback 回调
 */
function transfer(token_address, to_address, amount, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
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
exports.transfer = transfer;
/**
 * 从**转账
 * @param token_address 币的地址
 * @param from_address 出账地址
 * @param to_address 入账地址
 * @param amount 数量 常数
 * @param callback 回调
 */
function transferFrom(token_address, from_address, to_address, amount, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
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
exports.transferFrom = transferFrom;
function getDecimal(token_address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, decimal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 1:
                    decimal = _a.sent();
                    return [2 /*return*/, decimal];
            }
        });
    });
}
exports.getDecimal = getDecimal;
/**
 * approve Token
 * @param token_address 币地址
 * @param destina_address 目标地址
 * @param callback 回调
 */
function approveToken(token_address, destina_address, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, bigAmount, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
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
exports.approveToken = approveToken;
/**
 * 获取授权额度
 * @param token_address
 * @param destina_address
 * @returns
 */
function getAllowance(token_address, destina_address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, allowance, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
                    return [4 /*yield*/, tokenContract.methods.allowance(lib_const_1.userInfo.account, destina_address).call()];
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
exports.getAllowance = getAllowance;
/**
 * 执行合约
 * @param contract 合约实例
 * @param methodName 方法
 * @param value value
 * @param params 参数
 * @param callback 回调
 */
function executeContract(contract, methodName, value, params, callback) {
    var _a;
    (_a = contract.methods)[methodName].apply(_a, __spreadArray([], __read(params))).send({ from: lib_const_1.userInfo.account, value: value })
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
exports.executeContract = executeContract;
function connect(callback) {
    return __awaiter(this, void 0, void 0, function () {
        var resMsg, _ethereum, accounts, _a, e_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resMsg = {
                        account: "",
                        chainID: 0,
                        chain: "",
                        message: "success",
                    };
                    _ethereum = window["ethereum"];
                    if (!_ethereum)
                        return [2 /*return*/, resMsg];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, _ethereum.enable()];
                case 2:
                    accounts = _b.sent();
                    exports.web3 = new web3_1.default(_ethereum);
                    lib_const_1.userInfo.account = accounts[0];
                    _a = lib_const_1.userInfo;
                    return [4 /*yield*/, exports.web3.eth.getChainId()];
                case 3:
                    _a.chainID = (_b.sent());
                    lib_const_1.userInfo.chain = lib_const_1.chainIdDict[lib_const_1.userInfo.chainID];
                    resMsg.account = lib_const_1.userInfo.account;
                    resMsg.chainID = lib_const_1.userInfo.chainID;
                    resMsg.chain = lib_const_1.userInfo.chain;
                    _ethereum.on("accountsChanged", function (accounts) {
                        lib_const_1.userInfo.account = accounts[0];
                        callback({
                            account: lib_const_1.userInfo.account,
                            chainID: lib_const_1.userInfo.chainID,
                            chain: lib_const_1.chainIdDict[lib_const_1.userInfo.chainID],
                            message: "success",
                        });
                    });
                    _ethereum.on("chainChanged", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = lib_const_1.userInfo;
                                    return [4 /*yield*/, exports.web3.eth.getChainId()];
                                case 1:
                                    _a.chainID = (_b.sent());
                                    callback({
                                        account: lib_const_1.userInfo.account,
                                        chainID: lib_const_1.userInfo.chainID,
                                        chain: lib_const_1.chainIdDict[lib_const_1.userInfo.chainID],
                                        message: "success",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _b.sent();
                    resMsg.message = e_2.message;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, resMsg];
            }
        });
    });
}
exports.connect = connect;
/**
 * 退出
 * @returns
 */
function logout() {
    lib_const_1.userInfo.account = "";
    lib_const_1.userInfo.chainID = 97;
    lib_const_1.userInfo.chain = "BSCTest";
    exports.web3 = null;
    return {
        account: "",
        chainID: 0,
        chain: "",
    };
}
exports.logout = logout;
//# sourceMappingURL=lib.utils.js.map