import Web3 from "web3";
export var web3: Web3;
import { ERC20 } from "./lib_abi";
import walletlink from 'walletlink';
import { BigNumber } from "bignumber.js";
import { Contract } from "web3-eth-contract";
import { chainIdDict, userInfo } from "./lib_config";
import WalletConnectProvider from "@walletconnect/web3-provider";

BigNumber.config({ ROUNDING_MODE: 1 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
const MAXNUM = (9999 * 99999 * 100000).toString();
/**
 * 大数转常数
 * @param number 大数
 * @param decimals 精度(可选)
 * @returns string
 */
export function convertBigNumberToNormal(number: string, decimals = 18) {
  let result = new BigNumber(number).dividedBy(new BigNumber(Math.pow(10, decimals)));
  return result.toFixed(10);
}
/**
 * 常数转大数
 * @param number 常数
 * @param decimals 精度(选填)
 * @param fix 截取(选填)
 * @returns string
 */
export function convertNormalToBigNumber(number: string, decimals = 18, fix = 0) {
  return new BigNumber(number).multipliedBy(new BigNumber(Math.pow(10, decimals))).minus(fix).toFixed(0);
}
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns string
 */
export function calculatePercentage(numerator: string, denominator: string) {
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
export function calculateMultiplied(number1: string, number2: string) {
  return new BigNumber(number1).multipliedBy(new BigNumber(number2)).toFixed(0);
}
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function minusBigNumber(number1: string, number2: string) {
  return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(0);
}
/**
 * 加 x+y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function add(number1: string, number2: string) {
  return new BigNumber(number1).plus(new BigNumber(number2)).toFixed(10);
}
/**
 * 减 x-y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function sub(number1: string, number2: string) {
  return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(10);
}
/**
 * 乘 x*y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function mul(number1: string, number2: string) {
  return new BigNumber(number1).times(new BigNumber(number2)).toFixed(10);
}
/**
 * 除  x/y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function div(number1: string, number2: string) {
  return new BigNumber(number1).div(new BigNumber(number2)).toFixed(10);
}
/**
 * deadline
 * @param delay time
 * @returns timestemp
 */
export function getDeadLine(delay: number) {
  return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface DictObject {
  [key: string]: string;
}
/**
 * 通过value找key
 * @param obj 对象
 * @param value value
 * @param compare 比较(可选)
 * @returns key
 */
export function findToken(obj: DictObject, value: string, compare = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()) {
  return Object.keys(obj).find((k) => compare(obj[k], value));
}
/**
 * 判断是否为以太坊地址
 * @param token_address 地址
 * @returns bool
 */
export async function isETHAddress(token_address: string) {
  try {
    var code = await web3.eth.getCode(token_address);
    if (code === "0x") {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
/**
 * 查币的余额
 * @param token_address 币地址
 * @returns 余额 常数
 */
export async function getBalance(token_address: string) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let balance = await tokenContract.methods.balanceOf(userInfo.account).call();
  return convertBigNumberToNormal(balance, await getDecimal(token_address));
}
/**
 * 转账
 * @param token_address 币地址
 * @param to_address 收款地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export async function transfer(token_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(tokenContract, "transfer", 0, [to_address, bigAmount], callback);
}
/**
 * 从**转账
 * @param token_address 币的地址
 * @param from_address 出账地址
 * @param to_address 入账地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export async function transferFrom(token_address: string, from_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(tokenContract, "transferFrom", 0, [from_address, to_address, bigAmount], callback);
}
/**
 * 获取币的精度
 * @param token_address 
 * @returns 
 */
export async function getDecimal(token_address: string) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let decimal = await tokenContract.methods.decimals().call();
  return decimal;
}
/**
 * approve Token
 * @param token_address 币地址
 * @param destina_address 目标地址
 * @param callback 回调
 */
export async function approveToken(token_address: string, destina_address: string, callback: (code: number, hash: string) => void) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal(token_address));
  executeContract(tokenContract, "approve", 0, [destina_address, bigAmount], callback);
}
/**
 * 获取授权额度
 * @param token_address 
 * @param destina_address 
 * @returns 
 */
export async function getAllowance(token_address: string, destina_address: string) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let allowance = await tokenContract.methods.allowance(userInfo.account, destina_address).call();
  return convertBigNumberToNormal(allowance, await getDecimal(token_address));
}
/**
 * 执行合约
 * @param contract 合约实例
 * @param methodName 方法
 * @param value value
 * @param params 参数
 * @param callback 回调
 */
export function executeContract(contract: Contract, methodName: string, value: number, params: any, callback: (code: number, hash: string) => void) {
  contract.methods[methodName](...params)
    .send({ from: userInfo.account, value: value })
    .on("transactionHash", function (hash: string) {
      callback(0, hash);
    })
    .on("confirmation", function (confirmationNumber: number, receipt: any) {
      if (confirmationNumber === 1) {
        callback(1, receipt.transactionHash);
      }
    })
    .on("error", function (error: any, message: any) {
      if (message && message.transactionHash) {
        callback(3, message.transactionHash);
      } else {
        callback(2, error.message);
      }
    });
}

let walletDisconnectTimer: any;

const provider = new WalletConnectProvider({
  rpc: {
    1: "https://jsonrpc.maiziqianbao.net/",
    56: 'https://bsc-dataseed.binance.org/',
  },
});

const walletLink = new walletlink({
  appName: "Multiple",
  appLogoUrl: "https://avatars.githubusercontent.com/u/23645629?s=48&v=4",
  darkMode: false
})

const coinbaseRpc = "https://jsonrpc.maiziqianbao.net/";
/**
 * 链接钱包
 * @param walletName 钱包的名字小写
 * @param callback 
 * @returns 
 */
export async function connect(walletName: "walletconnect" | "metamask" | "huobiwallet" | "mathwallet" | "tokenpocket" | "coinbasewallet", callback: (data: { account: string; chainID: number; chain: string, message: string; }) => void) {
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
      web3 = new Web3(provider);
      userInfo.account = provider.accounts[0].toLowerCase();
      userInfo.chainID = await web3.eth.getChainId() as typeof userInfo.chainID;
      resMsg.account = userInfo.account;
      resMsg.chain = chainIdDict[userInfo.chainID];
      resMsg.message = "success";
      provider.on("accountsChanged", (accounts: string[]) => {
        userInfo.account = accounts[0].toLowerCase();
        callback({
          account: userInfo.account,
          chainID: userInfo.chainID,
          chain: chainIdDict[userInfo.chainID],
          message: "accountsChanged",
        });
      });
      provider.on("chainChanged", async (chainId: number) => {
        userInfo.chainID = await web3.eth.getChainId() as typeof userInfo.chainID;
        callback({
          account: userInfo.account,
          chainID: userInfo.chainID,
          chain: chainIdDict[userInfo.chainID],
          message: "chainChanged",
        });
      });
      provider.on("disconnect", (code: number, reason: string) => {
        if (walletDisconnectTimer !== null) clearTimeout(walletDisconnectTimer)
        walletDisconnectTimer = setTimeout(() => {
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
            })
          }
        }, 300);
      })
    } else if (walletName === "coinbasewallet") {
      let _ethereum = walletLink.makeWeb3Provider(coinbaseRpc, 1);
      let accounts = await _ethereum.enable();
      web3 = new Web3(_ethereum);
      userInfo.account = accounts[0].toLocaleLowerCase();
      userInfo.chainID = 1;
      userInfo.chain = "Ethereum";
      resMsg.account = userInfo.account;
      resMsg.chainID = userInfo.chainID;
      resMsg.chain = userInfo.chain;
      _ethereum.on("disconnect", (code: number, reason: string) => {
        if (code) {
          userInfo.account = "";
          userInfo.chainID = 1;
          userInfo.chain = "Ethereum";
          callback({
            account: "",
            chainID: 1,
            chain: "",
            message: "disconnect",
          })
        }
      })
    } else {
      //@ts-ignore
      let _ethereum = window["ethereum"];
      if (!_ethereum) {
        resMsg.message = "Check your wallet!";
        return resMsg;
      }
      let accounts = await _ethereum.enable();
      web3 = new Web3(_ethereum);
      userInfo.account = accounts[0].toLocaleLowerCase();
      userInfo.chainID = await web3.eth.getChainId() as typeof userInfo.chainID;
      userInfo.chain = chainIdDict[userInfo.chainID] as typeof userInfo.chain;
      resMsg.account = userInfo.account;
      resMsg.chainID = userInfo.chainID;
      resMsg.chain = userInfo.chain;
      _ethereum.on("accountsChanged", (accounts: string[]) => {
        userInfo.account = accounts[0].toLowerCase();
        callback({
          account: userInfo.account,
          chainID: userInfo.chainID,
          chain: chainIdDict[userInfo.chainID],
          message: "accountsChanged",
        });
      });
      _ethereum.on("chainChanged", async () => {
        userInfo.chainID = await web3.eth.getChainId() as typeof userInfo.chainID;
        callback({
          account: userInfo.account,
          chainID: userInfo.chainID,
          chain: chainIdDict[userInfo.chainID],
          message: "chainChanged",
        });
      });
    }
  } catch (e) {
    resMsg.message = e.message;
  }
  return resMsg;
}
/**
 * 一键添加切换BSC/HECO智能链
 * @param chainName "BSC" | "HECO"
 * @returns "" 无返回
 */
export async function changeMetamaskChain(chainName: "PLAYGROUND" | "HECO") {
  //@ts-ignore
  let _ethereum = window['ethereum'];
  if (!_ethereum || !_ethereum.isMetaMask) {
    return;
  }
  const PLAYGROUNDinfo = [{
    chainId: '0x150',
    chainName: 'Multiple Testnet',
    nativeCurrency:
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://testnet.multiple.fi'],
    blockExplorerUrls: ['https://testnet.multiple.fi'],
  }];
  const HECOinfo = [{
    chainId: '0x80',
    chainName: 'HECO Mainnet',
    nativeCurrency:
    {
      name: 'HT',
      symbol: 'HT',
      decimals: 18
    },
    rpcUrls: ['https://http-mainnet.hecochain.com/'],
    blockExplorerUrls: ['https://hecoinfo.com/'],
  }];
  let data = chainName == "PLAYGROUND" ? PLAYGROUNDinfo : HECOinfo;
  await _ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
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
  }
}
//全局log
let isTrace = false;
/**
 * 删除数字末尾多余的0
 * @param str 
 * @returns 字符串型的数字
 */
export function toPrecision(str: string) {
  if (!Boolean(str)) return '0';
  if (!(/^[0-9.]+$/g.test(str))) return '0';
  while (str.includes(".") && (str.endsWith('.') || str.endsWith('0'))) {
    str = str.slice(0, -1)
  }
  return str
}

export class Trace {
  public constructor() {
  }
  /**
   *设置log的开关
   * @param b bool
   */
  public static setTraceShow(b: boolean) {
    isTrace = b;
  }
  /**
   * log的内容
   * @param message log提示
   * @param optionalParams log内容
   */
  public static trace(message?: string, ...optionalParams: any[]) {
    if (isTrace) {
      console.log(message, ...optionalParams);
    }
  }
}