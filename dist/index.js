import { ERC20, MULBANK, MULWORK, UNISWAPV3POOL, UNISWAPV3STRATEGY } from "./lib_abi";
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
    let decimal = await getDecimal(token_address);
    let mulBankContract = new web3.eth.Contract(MULBANK, ContractAddress[userInfo.chainID].mulBank);
    let _totalShare = await mulBankContract.methods.getTotalShare(token_address).call();
    let totalShare = convertBigNumberToNormal(_totalShare, decimal);
    let res = await mulBankContract.methods.poolInfo(token_address).call();
    let tokenContract = new web3.eth.Contract(ERC20, res.shareToken);
    let _shareTokenTotalSupply = await tokenContract.methods.totalSupply().call();
    let shareTokenTotalSupply = convertBigNumberToNormal(_shareTokenTotalSupply, decimal);
    let shareTokenBalance = await getBalance(res.shareToken);
    return {
        data: {
            supplyToken: res.supplyToken,
            shareToken: res.shareToken,
            shareTokenBalance: shareTokenBalance,
            reward: (+shareTokenBalance - (+shareTokenBalance * +totalShare / +shareTokenTotalSupply)).toFixed(8),
            totalBorrow: convertBigNumberToNormal(res.totalBorrow, decimal),
            loss: convertBigNumberToNormal(res.loss, decimal),
            totalDeposit: convertBigNumberToNormal(res.totalDeposit, decimal),
        }
    };
}
/**
 * 投资前查询创建的账户信息
 * @returns
 */
export async function workers() {
    let mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
    let res = await mulWorkContract.methods.workers(userInfo.account).call();
    return {
        data: {
            createTime: res.createTime,
            created: res.created,
            lastWorkTime: res.lastWorkTime,
            power: res.power,
            totalProfit: res.totalProfit,
            workerId: res.workerId
        }
    };
}
/**
 *
 * @param token0_address
 * @param token1_address
 * @param ratio 价格
 * @returns
 */
async function getTick(token0_address, token1_address, ratio) {
    if (Number(token0_address) > Number(token1_address)) {
        let temp = token0_address;
        token0_address = token1_address;
        token1_address = temp;
    }
    let val0 = Math.log2(ratio);
    let val1 = Math.log2(1.0001);
    let ans = Math.floor(val0 / val1);
    if (val0 > 0) {
        return (ans - ans % 60).toString();
    }
    else {
        return (ans - (200 - Math.abs(ans) % 60)).toString();
    }
}
/**
 * 获取池子的价格（暂时只有 usdt/btc）
 * @param token0_address
 * @param token1_address
 * @returns
 */
export async function getSqrtPrice(token0_address, token1_address) {
    if (Number(token0_address) > Number(token1_address)) {
        let temp = token0_address;
        token0_address = token1_address;
        token1_address = temp;
    }
    let v3poolContract = new web3.eth.Contract(UNISWAPV3POOL, ContractAddress[userInfo.chainID].v3pool);
    let res = await v3poolContract.methods.slot0().call();
    let tick = res.tick; //参考
    return Math.pow(res.sqrtPriceX96 / (Math.pow(2, 96)), 2);
}
/**
 * 获取投资最大值
 * @param token0_address
 * @param token1_address
 * @returns
 */
export async function getRemainQuota(token0_address, token1_address) {
    let mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
    let remain0 = await mulWorkContract.methods.getRemainQuota(userInfo.account, token0_address).call();
    let remain1 = await mulWorkContract.methods.getRemainQuota(userInfo.account, token1_address).call();
    return {
        data: {
            token0: token0_address,
            symbol0: getTokenSymbol(token0_address),
            remain0: convertBigNumberToNormal(remain0, await getDecimal(token0_address)),
            token1: token1_address,
            symbol1: getTokenSymbol(token1_address),
            remain1: convertBigNumberToNormal(remain1, await getDecimal(token1_address)),
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
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
    executeContract(mulBankContract, "deposit", 0, [token_address, bigAmount], callback);
}
/**
 * withdraw 提出
 * @param token_address
 * @param amount
 * @param callback
 */
export async function withdraw(token_address, amount, callback) {
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
export async function invest(token0_address, token1_address, fee, amount0, amount1, leftPrice, rightPrice, callback) {
    let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
    let tickLower = await getTick(token0_address, token1_address, +leftPrice);
    let tickUpper = await getTick(token0_address, token1_address, +rightPrice);
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
 * 撤资
 * @param id
 * @param callback
 */
export function divest(id, callback) {
    let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
    executeContract(v3strategyContract, "divest", 0, [id], callback);
}
/**
 * 创建账号（投资前先创建）
 * @param callback
 */
export function createAccount(callback) {
    let mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
    executeContract(mulWorkContract, "createAccount", 0, [], callback);
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
 * 拿投资列表（缓存的）
 * @returns
 */
export function getList() {
    return rankList;
}
/**
 * 拿投资列表
 * @returns
 */
export async function getinvestList() {
    const query = `
    {
      positions(where:{user:"${userInfo.account}"}) {
        id
        user
        positionId
        token0
        token1
        debt0
        debt1
        exit0
        exit1
        liquidity
        tickLower
        tickUpper
        close
        }
      }
    `;
    return fetch(ContractAddress[userInfo.chainID].graphql, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query, }),
    }).then((response) => response.json())
        .then((data) => {
        let history = data.data.positions;
        return rankList = {
            data: history.map((item) => {
                return {
                    ...item,
                    debt0: convertBigNumberToNormal(item.debt0, 18),
                    debt1: convertBigNumberToNormal(item.debt1, 18),
                    priceLower: Math.pow(1.0001, item.tickLower),
                    priceUpper: Math.pow(1.0001, item.tickUpper),
                    symbol0: getTokenSymbol(item.token0),
                    symbol1: getTokenSymbol(item.token1),
                };
            }),
        };
    })
        .catch(() => {
        rankList = { data: [] };
    });
}
//# sourceMappingURL=index.js.map