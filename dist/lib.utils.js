import Web3 from "web3";
export var web3;
import { ERC20 } from "./lib_abi";
import { BigNumber } from "bignumber.js";
import { chainIdDict, userInfo } from "./lib_const";
import WalletConnectProvider from "@walletconnect/web3-provider";
BigNumber.config({ ROUNDING_MODE: 1 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
export function convertBigNumberToNormal(number, decimals = 18) {
    let result = new BigNumber(number).dividedBy(new BigNumber(Math.pow(10, decimals)));
    return result.toFixed(10);
}
export function convertNormalToBigNumber(number, decimals = 18, fix = 0) {
    return new BigNumber(number).multipliedBy(new BigNumber(Math.pow(10, decimals))).minus(fix).toFixed(0);
}
export function calculatePercentage(numerator, denominator) {
    return new BigNumber(numerator)
        .dividedBy(new BigNumber(denominator))
        .toFixed();
}
export function calculateMultiplied(number1, number2) {
    return new BigNumber(number1).multipliedBy(new BigNumber(number2)).toFixed(0);
}
export function minusBigNumber(number1, number2) {
    return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(0);
}
export function add(number1, number2) {
    return new BigNumber(number1).plus(new BigNumber(number2)).toFixed(10);
}
export function sub(number1, number2) {
    return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(10);
}
export function mul(number1, number2) {
    return new BigNumber(number1).times(new BigNumber(number2)).toFixed(10);
}
export function div(number1, number2) {
    return new BigNumber(number1).div(new BigNumber(number2)).toFixed(10);
}
export function getDeadLine(delay) {
    return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
export function findToken(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find((k) => compare(obj[k], value));
}
export async function isETHAddress(token_address) {
    try {
        var code = await web3.eth.getCode(token_address);
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
export async function getBalance(token_address) {
    let tokenContract = new web3.eth.Contract(ERC20, token_address);
    let balance = await tokenContract.methods.balanceOf(userInfo.account).call();
    return convertBigNumberToNormal(balance, await getDecimal(token_address));
}
export async function transfer(token_address, to_address, amount, callback) {
    let tokenContract = new web3.eth.Contract(ERC20, token_address);
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
    executeContract(tokenContract, "transfer", 0, [to_address, bigAmount], callback);
}
export async function transferFrom(token_address, from_address, to_address, amount, callback) {
    let tokenContract = new web3.eth.Contract(ERC20, token_address);
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
    executeContract(tokenContract, "transferFrom", 0, [from_address, to_address, bigAmount], callback);
}
export async function getDecimal(token_address) {
    let tokenContract = new web3.eth.Contract(ERC20, token_address);
    let decimal = await tokenContract.methods.decimals().call();
    return decimal;
}
export async function approveToken(token_address, destina_address, callback) {
    let tokenContract = new web3.eth.Contract(ERC20, token_address);
    let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal(token_address));
    executeContract(tokenContract, "approve", 0, [destina_address, bigAmount], callback);
}
export async function getAllowance(token_address, destina_address) {
    let tokenContract = new web3.eth.Contract(ERC20, token_address);
    let allowance = await tokenContract.methods.allowance(userInfo.account, destina_address).call();
    return convertBigNumberToNormal(allowance, await getDecimal(token_address));
}
export function executeContract(contract, methodName, value, params, callback) {
    contract.methods[methodName](...params)
        .send({ from: userInfo.account, value: value })
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
let walletDisconnectTimer;
const provider = new WalletConnectProvider({
    rpc: {
        1: "https://jsonrpc.maiziqianbao.net/",
        56: 'https://bsc-dataseed4.defibit.io:443',
    },
});
export async function connect(walletName, callback) {
    let resMsg = {
        account: "",
        chainID: 0,
        chain: "",
        message: "success",
    };
    try {
        if (walletName === "walletconnect") {
            await provider.enable();
            web3 = new Web3(provider);
            userInfo.account = provider.accounts[0];
            userInfo.chainID = await web3.eth.getChainId();
            resMsg.account = userInfo.account;
            resMsg.chain = chainIdDict[userInfo.chainID];
            resMsg.message = "success";
            provider.on("accountsChanged", (accounts) => {
                userInfo.account = accounts[0];
                callback({
                    account: userInfo.account,
                    chainID: userInfo.chainID,
                    chain: chainIdDict[userInfo.chainID],
                    message: "accountsChanged",
                });
            });
            provider.on("chainChanged", async (chainId) => {
                userInfo.chainID = await web3.eth.getChainId();
                callback({
                    account: userInfo.account,
                    chainID: userInfo.chainID,
                    chain: chainIdDict[userInfo.chainID],
                    message: "chainChanged",
                });
            });
            provider.on("disconnect", (code, reason) => {
                if (walletDisconnectTimer !== null)
                    clearTimeout(walletDisconnectTimer);
                walletDisconnectTimer = setTimeout(() => {
                    walletDisconnectTimer = null;
                    if (code) {
                        userInfo.account = "";
                        userInfo.chainID = 1;
                        userInfo.chain = "Ethereum";
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
            let _ethereum = window["ethereum"];
            if (!_ethereum)
                return resMsg;
            let accounts = await _ethereum.enable();
            web3 = new Web3(_ethereum);
            userInfo.account = accounts[0];
            userInfo.chainID = await web3.eth.getChainId();
            userInfo.chain = chainIdDict[userInfo.chainID];
            resMsg.account = userInfo.account;
            resMsg.chainID = userInfo.chainID;
            resMsg.chain = userInfo.chain;
            _ethereum.on("accountsChanged", (accounts) => {
                userInfo.account = accounts[0];
                callback({
                    account: userInfo.account,
                    chainID: userInfo.chainID,
                    chain: chainIdDict[userInfo.chainID],
                    message: "accountsChanged",
                });
            });
            _ethereum.on("chainChanged", async () => {
                userInfo.chainID = await web3.eth.getChainId();
                callback({
                    account: userInfo.account,
                    chainID: userInfo.chainID,
                    chain: chainIdDict[userInfo.chainID],
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
export function logout() {
    userInfo.account = "";
    userInfo.chainID = 1;
    userInfo.chain = "Ethereum";
    provider.disconnect();
    return {
        account: "",
        chainID: 1,
        chain: "",
        message: "logout",
    };
}
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
//# sourceMappingURL=lib.utils.js.map