import { getTick } from "./index";
import { userInfo, ContractAddress } from "./lib_config";
import { MULBANK, MULWORK, UNISWAPV3STRATEGY } from "./lib_abi";
import { web3, getDecimal, convertNormalToBigNumber, executeContract, approveToken as _approveToken } from "./lib.utils";
/**
 * 对token授权
 * @param token_address 
 * @param type 
 * @param callback 
 */
export async function approveToken(token_address: string, type: "deposit" | "invest", callback: (code: number, hash: string) => void) {
  let destina_address = ContractAddress[userInfo.chainID].mulBank;
  if (type === "deposit") {

  } else if (type === "invest") {
    destina_address = ContractAddress[userInfo.chainID].v3strategy;
  }
  _approveToken(token_address, destina_address, callback);
}
/**
 * deposit买入
 * @param token_address 
 * @param amount 
 * @param callback 
 */
export async function deposit(token_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(mulBankContract, "deposit", 0, [token_address, bigAmount], callback);
}
/**
 * withdraw 提出
 * @param token_address 
 * @param amount 
 * @param callback 
 */
export async function withdraw(token_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(mulBankContract, "withdraw", 0, [token_address, bigAmount], callback);
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
export async function invest(token0_address: string, token1_address: string, fee: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
  let tickLower = getTick(token0_address, token1_address, +leftPrice);
  let tickUpper = getTick(token0_address, token1_address, +rightPrice);
  if (+tickLower > +tickUpper) {
    [tickLower, tickUpper] = [tickUpper, tickLower];
  }
  let bigAmount0 = convertNormalToBigNumber(amount0, await getDecimal(token0_address));
  let bigAmount1 = convertNormalToBigNumber(amount1, await getDecimal(token1_address));
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
}
/**
 * 追加
 * @param token0_address 
 * @param token1_address 
 * @param id 
 * @param amount0 
 * @param amount1 
 * @param callback 
 */
export async function addInvest(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
  let bigAmount0 = convertNormalToBigNumber(amount0, await getDecimal(token0_address));
  let bigAmount1 = convertNormalToBigNumber(amount1, await getDecimal(token1_address));
  executeContract(v3strategyContract, "add", 0, [id, bigAmount0, bigAmount1], callback);
}
/**
 * 切仓
 * @param token0_address 
 * @param token1_address 
 * @param id 
 * @param amount0 
 * @param amount1 
 * @param leftPrice 
 * @param rightPrice 
 * @param hedge 
 * @param callback 
 */
export async function switching(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, hedge: boolean, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
  let tickLower = getTick(token0_address, token1_address, +leftPrice);
  let tickUpper = getTick(token0_address, token1_address, +rightPrice);
  if (+tickLower > +tickUpper) {
    [tickLower, tickUpper] = [tickUpper, tickLower];
  }
  let bigAmount0 = convertNormalToBigNumber(amount0, await getDecimal(token0_address));
  let bigAmount1 = convertNormalToBigNumber(amount1, await getDecimal(token1_address));
  executeContract(v3strategyContract, "switching", 0, [id, {
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Desired: bigAmount0,
    amount1Desired: bigAmount1,
  }, hedge], callback);
}
/**
 * 撤资
 * @param id 
 * @param isclose 
 * @param callback 
 */
export function divest(id: string, isclose: boolean, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
  executeContract(v3strategyContract, "divest", 0, [id, isclose], callback);
}
/**
 * 创建账号（投资前先创建）
 * @param callback 
 */
export function createAccount(callback: (code: number, hash: string) => void) {
  let mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
  executeContract(mulWorkContract, "createAccount", 0, [], callback);
}