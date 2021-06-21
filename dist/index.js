import { userInfo, tokenAddres, ContractAddress } from "./lib_const";
import { ERC20, MULBANK, MULWORK, UNISWAPV3POOL, UNISWAPV3STRATEGY } from "./lib_abi";
import { web3, Trace, findToken, getDecimal, convertBigNumberToNormal, convertNormalToBigNumber, executeContract, addMetamaskChain as _addMetamaskChain, toPrecision as _toPrecision, logout as _logout, sleep as _sleep, connect as _connect, getBalance as _getBalance, getAllowance as _getAllowance, approveToken as _approveToken, isETHAddress as _isETHAddress } from "./lib.utils";
export const T = Trace;
export const sleep = _sleep;
export const logout = _logout;
export const connect = _connect;
export const getBalance = _getBalance;
export const toPrecision = _toPrecision;
export const isETHAddress = _isETHAddress;
export const addMetamaskChain = _addMetamaskChain;
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
 * @param type
 * @returns
 */
export async function getAllowance(token_address, type) {
    let destina_address = ContractAddress[userInfo.chainID].mulBank;
    if (type === "deposit") {
    }
    else if (type === "ivest") {
        destina_address = ContractAddress[userInfo.chainID].v3strategy;
    }
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
    let _totalShare = await mulBankContract.methods.getTotalShare(token_address).call({ from: userInfo.account });
    let totalShare = convertBigNumberToNormal(_totalShare, decimal);
    let res = await mulBankContract.methods.poolInfo(token_address).call({ from: userInfo.account });
    let tokenContract = new web3.eth.Contract(ERC20, res.shareToken);
    let _shareTokenTotalSupply = await tokenContract.methods.totalSupply().call({ from: userInfo.account });
    let shareTokenTotalSupply = convertBigNumberToNormal(_shareTokenTotalSupply, decimal);
    let shareTokenBalance = await getBalance(res.shareToken);
    let reward = '0';
    if (+shareTokenTotalSupply <= 0) {
        reward = '0';
    }
    else {
        reward = (+shareTokenBalance - (+shareTokenBalance * +totalShare / +shareTokenTotalSupply)).toFixed(8);
    }
    return {
        data: {
            supplyToken: res.supplyToken,
            shareToken: res.shareToken,
            shareTokenBalance: shareTokenBalance,
            reward: reward,
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
    let res = await mulWorkContract.methods.workers(userInfo.account).call({ from: userInfo.account });
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
 * 拿fee
 * @param sid
 * @returns
 */
export async function collect(sid) {
    let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
    let res = await v3strategyContract.methods.collect(+sid).call({ from: userInfo.account });
    return {
        data: {
            fee0: convertBigNumberToNormal(res.fee0, 6),
            fee1: convertBigNumberToNormal(res.fee1, 18),
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
function getTick(token0_address, token1_address, price) {
    if (Number(token0_address) > Number(token1_address)) {
        let temp = token0_address;
        token0_address = token1_address;
        token1_address = temp;
    }
    let ans = Math.floor(Math.log2(1 / price * 1e12) / Math.log2(1.0001));
    if (Math.log2(1 / price * 1e12) > 0) {
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
        [token0_address, token1_address] = [token1_address, token0_address];
    }
    let v3poolContract = new web3.eth.Contract(UNISWAPV3POOL, ContractAddress[userInfo.chainID].v3pool);
    let res = await v3poolContract.methods.slot0().call({ from: userInfo.account });
    let tick = res.tick; //参考
    let temp = Math.pow(res.sqrtPriceX96 / (Math.pow(2, 96)), 2);
    return 1 / temp * 1e12;
}
/**
 * 获取投资最大值
 * @param token0_address
 * @param token1_address
 * @returns
 */
export async function getRemainQuota(token0_address, token1_address) {
    let mulWorkContract = new web3.eth.Contract(MULWORK, ContractAddress[userInfo.chainID].mulWork);
    let remain0 = await mulWorkContract.methods.getRemainQuota(userInfo.account, token0_address).call({ from: userInfo.account });
    let remain1 = await mulWorkContract.methods.getRemainQuota(userInfo.account, token1_address).call({ from: userInfo.account });
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
/**
 *算出对应token的量  sqrtPrice = sqrt(b/a) * 2^96 = sqrt(1.0001^tick) * 2^96
 * @param type
 * @param token0_address
 * @param token1_address
 * @param priceLower
 * @param priceCurrent
 * @param priceUpper
 * @param amount
 * @returns c * b / (c - b) * (b - a);      c a  互换位置
 */
export async function getTokenValue(type, token0_address, token1_address, priceLower, priceCurrent, priceUpper, amount) {
    let v3poolContract = new web3.eth.Contract(UNISWAPV3POOL, ContractAddress[userInfo.chainID].v3pool);
    let res = await v3poolContract.methods.slot0().call({ from: userInfo.account });
    let resultAmount = 0;
    let tickLower = getTick(token0_address, token1_address, priceUpper);
    let tickCurrent = getTick(token0_address, token1_address, priceCurrent);
    let tickUpper = getTick(token0_address, token1_address, priceLower);
    let sqrtPricelower = Math.sqrt(Math.pow(1.0001, +tickLower));
    let sqrtPriceCurrent = Math.sqrt(Math.pow(1.0001, +tickCurrent)); //slot0    sqrpicex96/2**96
    let sqrtPriceupper = Math.sqrt(Math.pow(1.0001, +tickUpper));
    let a = sqrtPricelower;
    // let b=sqrtPriceCurrent;
    let b = res.sqrtPriceX96 / (Math.pow(2, 96));
    let c = sqrtPriceupper;
    if (type === "token0") { //usdt
        let temp = c * b / (c - b) * (b - a);
        resultAmount = temp / 1e12 * amount;
    }
    else { //eth
        let temp = (c - b) / (b - a) / (b * c);
        resultAmount = temp * 1e12 * amount;
    }
    return { amount: resultAmount };
}
/**
 * 拿tick上的价格
 * @param token0_address
 * @param token1_address
 * @param price
 * @returns
 */
export function getCloseToTickPrice(token0_address, token1_address, price) {
    let tick = getTick(token0_address, token1_address, price);
    return 1 / Math.pow(1.0001, +tick) * 1e12;
}
//---------------------------------------------------上查下操作------------------------------------------------------
/**
 * 对token授权
 * @param token_address
 * @param type
 * @param callback
 */
export async function approveToken(token_address, type, callback) {
    let destina_address = ContractAddress[userInfo.chainID].mulBank;
    if (type === "deposit") {
    }
    else if (type === "ivest") {
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
    let tickLower = getTick(token0_address, token1_address, +leftPrice);
    let tickUpper = getTick(token0_address, token1_address, +rightPrice);
    if (+tickLower > +tickUpper) {
        [tickLower, tickUpper] = [tickUpper, tickLower];
    }
    let bigAmount0 = convertNormalToBigNumber(amount0, await getDecimal(token0_address));
    let bigAmount1 = convertNormalToBigNumber(amount1, await getDecimal(token1_address));
    console.log("-----v3strategyContract---------", v3strategyContract);
    console.log("---tickLower--", tickLower);
    console.log("---tickUpper---", tickUpper);
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
export async function addInvest(token0_address, token1_address, id, amount0, amount1, callback) {
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
export async function switching(token0_address, token1_address, id, amount0, amount1, leftPrice, rightPrice, hedge, callback) {
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
export function divest(id, isclose, callback) {
    let v3strategyContract = new web3.eth.Contract(UNISWAPV3STRATEGY, ContractAddress[userInfo.chainID].v3strategy);
    executeContract(v3strategyContract, "divest", 0, [id, isclose], callback);
}
export function divest1(id, callback) {
    let api = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "changeOwner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "oldOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnerSet",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "throwError",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getOwner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    //@ts-ignore
    let v3strategyContract = new web3.eth.Contract(api, "0xA2427ccE613052493AFff8cf19E50FD065C10466");
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
//# sourceMappingURL=index.js.map