import { ERC20 } from "./ERC20";
import { BigNumber } from "bignumber.js";
import Web3 from "web3";

export var web3: any;
export var useinfo = {
  account: "",
  chainID: "",
};
/**
 * 大数转常数
 * @param number 大数
 * @param decimals 精度(可选)
 * @returns
 */
export function convertBigNumberToNormal(number: string, decimals = 18) {
  let result = new BigNumber(number).dividedBy(
    new BigNumber(Math.pow(10, decimals))
  );
  return result.toFixed();
}
/**
 * 常数转大数
 * @param number 常数
 * @param decimals 精度(选填)
 * @param fix 截取(选填)
 * @returns
 */
export function convertNormalToBigNumber(
  number: string,
  decimals = 18,
  fix = 0
) {
  return new BigNumber(number)
    .multipliedBy(new BigNumber(Math.pow(10, decimals)))
    .minus(fix)
    .toFixed(0);
}
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns
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
 * @returns
 */
export function calculateMultiplied(number1: string, number2: string) {
  return new BigNumber(number1).multipliedBy(new BigNumber(number2)).toFixed(0);
}
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns
 */
export function minusBigNumber(number1: string, number2: string) {
  return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(0);
}
/**
 * 加 x+y
 * @param number1 x
 * @param number2 y
 * @returns
 */
export function add(number1: string, number2: string) {
  return new BigNumber(number1).plus(new BigNumber(number2)).toFixed(10);
}
/**
 * 减 x-y
 * @param number1 x
 * @param number2 y
 * @returns
 */
export function sub(number1: string, number2: string) {
  return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(10);
}
/**
 * 乘 x*y
 * @param number1 x
 * @param number2 y
 * @returns
 */
export function mul(number1: string, number2: string) {
  return new BigNumber(number1).times(new BigNumber(number2)).toFixed(10);
}
/**
 * 除  x/y
 * @param number1 x
 * @param number2 y
 * @returns
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
export function findToken(
  obj: DictObject,
  value: string,
  compare = (a: string, b: string) => a === b
) {
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
  let balance = await tokenContract.methods.balanceOf(useinfo.account).call();
  return convertBigNumberToNormal(balance, await getDecimal(token_address));
}
/**
 * 转账
 * @param token_address 币地址
 * @param to_address 收款地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export async function transfer(
  token_address: string,
  to_address: string,
  amount: string,
  callback: any
) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber(
    amount,
    await getDecimal(token_address)
  );
  executeContract(
    tokenContract,
    "transfer",
    0,
    [to_address, bigAmount],
    callback
  );
}
/**
 * 从**转账
 * @param token_address 币的地址
 * @param from_address 出账地址
 * @param to_address 入账地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export async function transferFrom(
  token_address: string,
  from_address: string,
  to_address: string,
  amount: string,
  callback: any
) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber(
    amount,
    await getDecimal(token_address)
  );
  executeContract(
    tokenContract,
    "transferFrom",
    0,
    [from_address, to_address, bigAmount],
    callback
  );
}

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
export async function approveToken(
  token_address: string,
  destina_address: string,
  callback: any
) {
  let tokenContract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber(
    "500000000000",
    await getDecimal(token_address)
  );
  executeContract(
    tokenContract,
    "approve",
    0,
    [destina_address, bigAmount],
    callback
  );
}
/**
 * 执行合约
 * @param contract 合约
 * @param methodName 方法
 * @param value value
 * @param params 参数
 * @param callback 回调
 */
export function executeContract(
  contract: any,
  methodName: string,
  value: number,
  params: any,
  callback: any
) {
  contract.methods[methodName](...params)
    .send({ from: useinfo.account, value: value })
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
/**
 * 链接metamask
 * @param callback 切链换账号的回调
 * @returns 首次连接的返回
 */
export async function connect(callback: any) {
  let resMsg = {
    account: "",
    currentChainID: "",
    message: "",
  };
  //@ts-ignore
  let _ethereum = window["ethereum"];
  if (!_ethereum) return resMsg;
  try {
    let accounts = await _ethereum.enable();
    web3 = new Web3(_ethereum);
    useinfo.account = accounts[0];
    useinfo.chainID = await web3.eth.getChainId();
    resMsg.message = "success";
    resMsg.account = useinfo.account;
    resMsg.currentChainID = useinfo.chainID;
    _ethereum.on("accountsChanged", (accounts: any) => {
      useinfo.account = accounts[0];
      callback({
        account: useinfo.account,
        currentChainID: useinfo.chainID,
        message: "success",
      });
    });
    _ethereum.on("chainChanged", async () => {
      useinfo.chainID = await web3.eth.getChainId();
      callback({
        account: useinfo.account,
        currentChainID: useinfo.chainID,
        message: "success",
      });
    });
  } catch (e) {
    resMsg.message = e.message;
  }
  return resMsg;
}
