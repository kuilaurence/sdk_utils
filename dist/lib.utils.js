"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutZero = exports.logout = exports.connect = exports.executeContract = exports.getAllowance = exports.approveToken = exports.getDecimal = exports.transferFrom = exports.transfer = exports.getBalance = exports.isETHAddress = exports.findToken = exports.getDeadLine = exports.div = exports.mul = exports.sub = exports.add = exports.minusBigNumber = exports.calculateMultiplied = exports.calculatePercentage = exports.convertNormalToBigNumber = exports.convertBigNumberToNormal = exports.web3 = void 0;
const web3_1 = __importDefault(require("web3"));
const lib_abi_1 = require("./lib_abi");
const bignumber_js_1 = require("bignumber.js");
const lib_const_1 = require("./lib_const");
const web3_provider_1 = __importDefault(require("@walletconnect/web3-provider"));
bignumber_js_1.BigNumber.config({ ROUNDING_MODE: 1 }); //下取整
bignumber_js_1.BigNumber.config({ EXPONENTIAL_AT: 1e+9 }); //消除科学计数法
/**
 * 大数转常数
 * @param number 大数
 * @param decimals 精度(可选)
 * @returns string
 */
function convertBigNumberToNormal(number, decimals = 18) {
    let result = new bignumber_js_1.BigNumber(number).dividedBy(new bignumber_js_1.BigNumber(Math.pow(10, decimals)));
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
function convertNormalToBigNumber(number, decimals = 18, fix = 0) {
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
function findToken(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find((k) => compare(obj[k], value));
}
exports.findToken = findToken;
/**
 * 判断是否为以太坊地址
 * @param token_address 地址
 * @returns bool
 */
async function isETHAddress(token_address) {
    try {
        var code = await exports.web3.eth.getCode(token_address);
        if (code === "0x") {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
}
exports.isETHAddress = isETHAddress;
/**
 * 查币的余额
 * @param token_address 币地址
 * @returns 余额 常数
 */
async function getBalance(token_address) {
    let tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
    let balance = await tokenContract.methods.balanceOf(lib_const_1.userInfo.account).call();
    return convertBigNumberToNormal(balance, await getDecimal(token_address));
}
exports.getBalance = getBalance;
/**
 * 转账
 * @param token_address 币地址
 * @param to_address 收款地址
 * @param amount 数量 常数
 * @param callback 回调
 */
async function transfer(token_address, to_address, amount, callback) {
    let tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
    executeContract(tokenContract, "transfer", 0, [to_address, bigAmount], callback);
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
async function transferFrom(token_address, from_address, to_address, amount, callback) {
    let tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
    executeContract(tokenContract, "transferFrom", 0, [from_address, to_address, bigAmount], callback);
}
exports.transferFrom = transferFrom;
async function getDecimal(token_address) {
    let tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
    let decimal = await tokenContract.methods.decimals().call();
    return decimal;
}
exports.getDecimal = getDecimal;
/**
 * approve Token
 * @param token_address 币地址
 * @param destina_address 目标地址
 * @param callback 回调
 */
async function approveToken(token_address, destina_address, callback) {
    let tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
    let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal(token_address));
    executeContract(tokenContract, "approve", 0, [destina_address, bigAmount], callback);
}
exports.approveToken = approveToken;
/**
 * 获取授权额度
 * @param token_address
 * @param destina_address
 * @returns
 */
async function getAllowance(token_address, destina_address) {
    let tokenContract = new exports.web3.eth.Contract(lib_abi_1.ERC20, token_address);
    let allowance = await tokenContract.methods.allowance(lib_const_1.userInfo.account, destina_address).call();
    return convertBigNumberToNormal(allowance, await getDecimal(token_address));
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
    contract.methods[methodName](...params)
        .send({ from: lib_const_1.userInfo.account, value: value })
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
let walletDisconnectTimer;
const provider = new web3_provider_1.default({
    rpc: {
        1: "https://jsonrpc.maiziqianbao.net/",
        56: 'https://bsc-dataseed4.defibit.io:443',
    },
});
/**
 * 链接钱包
 * @param walletName 钱包的名字小写
 * @param callback
 * @returns
 */
async function connect(walletName, callback) {
    let resMsg = {
        account: "",
        chainID: 0,
        chain: "",
        message: "success",
    };
    try {
        if (walletName === "walletconnect") {
            await provider.enable();
            //@ts-ignore
            exports.web3 = new web3_1.default(provider);
            lib_const_1.userInfo.account = provider.accounts[0];
            lib_const_1.userInfo.chainID = await exports.web3.eth.getChainId();
            resMsg.account = lib_const_1.userInfo.account;
            resMsg.chain = lib_const_1.chainIdDict[lib_const_1.userInfo.chainID];
            resMsg.message = "success";
            provider.on("accountsChanged", (accounts) => {
                lib_const_1.userInfo.account = accounts[0];
                callback({
                    account: lib_const_1.userInfo.account,
                    chainID: lib_const_1.userInfo.chainID,
                    chain: lib_const_1.chainIdDict[lib_const_1.userInfo.chainID],
                    message: "accountsChanged",
                });
            });
            provider.on("chainChanged", async (chainId) => {
                lib_const_1.userInfo.chainID = await exports.web3.eth.getChainId();
                callback({
                    account: lib_const_1.userInfo.account,
                    chainID: lib_const_1.userInfo.chainID,
                    chain: lib_const_1.chainIdDict[lib_const_1.userInfo.chainID],
                    message: "chainChanged",
                });
            });
            provider.on("disconnect", (code, reason) => {
                if (walletDisconnectTimer !== null)
                    clearTimeout(walletDisconnectTimer);
                walletDisconnectTimer = setTimeout(() => {
                    walletDisconnectTimer = null;
                    if (code) {
                        lib_const_1.userInfo.account = "";
                        lib_const_1.userInfo.chainID = 97;
                        lib_const_1.userInfo.chain = "BSCTest";
                        callback({
                            account: "",
                            chainID: 97,
                            chain: "",
                            message: "disconnect",
                        });
                    }
                }, 300);
            });
        }
        else {
            //@ts-ignore
            let _ethereum = window["ethereum"];
            if (!_ethereum)
                return resMsg;
            let accounts = await _ethereum.enable();
            exports.web3 = new web3_1.default(_ethereum);
            lib_const_1.userInfo.account = accounts[0];
            lib_const_1.userInfo.chainID = await exports.web3.eth.getChainId();
            lib_const_1.userInfo.chain = lib_const_1.chainIdDict[lib_const_1.userInfo.chainID];
            resMsg.account = lib_const_1.userInfo.account;
            resMsg.chainID = lib_const_1.userInfo.chainID;
            resMsg.chain = lib_const_1.userInfo.chain;
            _ethereum.on("accountsChanged", (accounts) => {
                lib_const_1.userInfo.account = accounts[0];
                callback({
                    account: lib_const_1.userInfo.account,
                    chainID: lib_const_1.userInfo.chainID,
                    chain: lib_const_1.chainIdDict[lib_const_1.userInfo.chainID],
                    message: "accountsChanged",
                });
            });
            _ethereum.on("chainChanged", async () => {
                lib_const_1.userInfo.chainID = await exports.web3.eth.getChainId();
                callback({
                    account: lib_const_1.userInfo.account,
                    chainID: lib_const_1.userInfo.chainID,
                    chain: lib_const_1.chainIdDict[lib_const_1.userInfo.chainID],
                    message: "chainChanged",
                });
            });
        }
    }
    catch (e) {
        resMsg.message = e.message;
    }
    return resMsg;
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
    provider.disconnect();
    return {
        account: "",
        chainID: 97,
        chain: "",
        message: "logout",
    };
}
exports.logout = logout;
/**
 * 删除数字末尾多余的0
 * @param str
 * @returns 字符串型的数字
 */
function cutZero(str) {
    if (!Boolean(str))
        return '0';
    if (!str.includes("."))
        return str;
    while (str.slice(-1) === "0") {
        str = str.slice(0, -1);
    }
    if (str.endsWith(".")) {
        str = str.slice(0, -1);
    }
    return str;
}
exports.cutZero = cutZero;
//# sourceMappingURL=lib.utils.js.map