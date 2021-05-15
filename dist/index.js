import { ERC20, MULBANK, UNISWAPV3STRATEGY } from "./lib_abi";
import { userInfo, tokenAddres, ContractAddress } from "./lib_const";
import { web3, Trace, findToken, getDecimal, convertBigNumberToNormal, convertNormalToBigNumber, executeContract, addMetamaskChain as _addMetamaskChain, toPrecision as _toPrecision, logout as _logout, sleep as _sleep, connect as _connect, getBalance as _getBalance, getAllowance as _getAllowance, approveToken as _approveToken, isETHAddress as _isETHAddress } from "./lib.utils";
export const T = Trace;
export const sleep = _sleep;
export const logout = _logout;
export const connect = _connect;
export const getBalance = _getBalance;
export const toPrecision = _toPrecision;
export const isETHAddress = _isETHAddress;
export const addMetamaskChain = _addMetamaskChain;
export var rankList;
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
    let symbol = findToken(tokenAddres[userInfo.chainID], token_address);
    return symbol || "unknow";
}
/**
 * 获取授权值
 * @param token_address
 * @returns
 */
export async function getAllowance(token_address) {
    let destina_address = ContractAddress[userInfo.chainID].mulBank;
    return await _getAllowance(token_address, destina_address);
}
/**
 * 池子存的数量
 * @param token_address
 * @returns
 */
export async function poolInfo(token_address) {
    let mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
    let res = await mulBankContract.methods.poolInfo(token_address).call();
    return {
        data: {
            supplyToken: res.supplyToken,
            shareToken: res.shareToken,
            totalBorrow: convertBigNumberToNormal(res.totalBorrow, 18),
            loss: convertBigNumberToNormal(res.loss, 18),
            totalDeposit: convertBigNumberToNormal(res.totalDeposit, 18),
        }
    };
}
//---------------------------------------------------上查下操作------------------------------------------------------
/**
 * 对token授权
 * @param token_address
 * @param callback
 */
export async function approveToken(token_address, callback) {
    let destina_address = ContractAddress[userInfo.chainID].mulBank;
    _approveToken(token_address, destina_address, callback);
}
/**
 * deposit买入
 * @param token_address
 * @param amount
 * @param callback
 */
export async function deposit(token_address, amount, callback) {
    let mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
    let bigAmount = convertNormalToBigNumber(amount, 18);
    executeContract(mulBankContract, "deposit", 0, [token_address, bigAmount], callback);
}
/**
 * withdraw 提出
 * @param token_address
 * @param amount
 * @param callback
 */
export function withdraw(token_address, amount, callback) {
    let mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
    let bigAmount = convertNormalToBigNumber(amount, 18);
    executeContract(mulBankContract, "withdraw", 0, [token_address, bigAmount], callback);
}
/**
 * 投资
 * @param token0_address
 * @param token1_address
 * @param fee
 * @param amount0
 * @param amount1
 * @param tickLower
 * @param tickUpper
 * @param callback
 */
export function invest(token0_address, token1_address, fee, amount0, amount1, tickLower, tickUpper, callback) {
    let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
    console.log("--------v3strategyContract--------", v3strategyContract);
    let bigfee = convertNormalToBigNumber(fee, 18);
    let bigAmount0 = convertNormalToBigNumber(amount0, 18);
    let bigAmount1 = convertNormalToBigNumber(amount1, 18);
    executeContract(v3strategyContract, "invest", 0, [token0_address, token1_address, bigfee, bigAmount0, bigAmount1, tickLower, tickUpper], callback);
}
export function Divest(token_address, amount, callback) {
    let mulWorkContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
    let bigAmount = convertNormalToBigNumber(amount, 18);
    executeContract(mulWorkContract, "Divest", 0, [token_address, bigAmount], callback);
}
/**
 * test
 * @param callback
 */
export async function test(callback) {
    let tokenContract = new web3.eth.Contract(ERC20, "0xae9269f27437f0fcbc232d39ec814844a51d6b8f");
    let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal("0xae9269f27437f0fcbc232d39ec814844a51d6b8f"));
    executeContract(tokenContract, "approve", 0, ["0xA94507E3bd5e3Cd414b37456ba716A92F4877d6e", bigAmount], callback);
}
//----------------------------------------服务器信息-----------------------------------------------------------
/**
 * 拿全网算力
 * @returns
 */
export async function networkHashrateInfo() {
    return fetch("https://api.ethst.io/api/v1/pool/v1/currency/stats?currency=ETH", { method: "get" }).then((response) => {
        return response.json();
    });
}
/**
 * 拿贡献榜单
 * @returns
 */
export function getRankList() {
    return rankList;
}
/**
 * 拿贡献榜单预先
 * @returns
 */
export async function getRankListBefore() {
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
        rankList = {
            data: nodeMiningStakes.map((item) => {
                return {
                    ...item,
                    amount: convertBigNumberToNormal(item.amount, 18),
                };
            }),
        };
    })
        .catch(() => {
        rankList = { data: [] };
    });
}
//# sourceMappingURL=index.js.map