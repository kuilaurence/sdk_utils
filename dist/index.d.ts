import { Trace, addMetamaskChain as _addMetamaskChain, toPrecision as _toPrecision, logout as _logout, connect as _connect, getBalance as _getBalance, isETHAddress as _isETHAddress } from "./lib.utils";
export declare const T: typeof Trace;
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const logout: typeof _logout;
export declare const connect: typeof _connect;
export declare const getBalance: typeof _getBalance;
export declare const toPrecision: typeof _toPrecision;
export declare const isETHAddress: typeof _isETHAddress;
export declare const addMetamaskChain: typeof _addMetamaskChain;
/**
 * 根据token symbol获取address
 * @param token_symbol
 * @returns
 */
export declare function getTokenAddress(token_symbol: string): string;
/**
 * 根据token address,获取symbol
 * @param token_address
 * @returns
 */
export declare function getTokenSymbol(token_address: string): string;
/**
 * 获取授权值
 * @param token_address
 * @param type
 * @returns
 */
export declare function getAllowance(token_address: string, type: "deposit" | "ivest"): Promise<string>;
/**
 * 池子存的数量
 * @param token_address
 * @returns
 */
export declare function poolInfo(token_address: string): Promise<{
    data: {
        supplyToken: any;
        shareToken: any;
        shareTokenBalance: string;
        reward: string;
        totalBorrow: string;
        loss: string;
        totalDeposit: string;
    };
}>;
/**
 * 投资前查询创建的账户信息
 * @returns
 */
export declare function workers(): Promise<{
    data: {
        createTime: any;
        created: any;
        lastWorkTime: any;
        power: any;
        totalProfit: any;
        workerId: any;
    };
}>;
/**
 * 获取池子的价格（暂时只有 usdt/btc）
 * @param token0_address
 * @param token1_address
 * @returns
 */
export declare function getSqrtPrice(token0_address: string, token1_address: string): Promise<number>;
/**
 * 获取投资最大值
 * @param token0_address
 * @param token1_address
 * @returns
 */
export declare function getRemainQuota(token0_address: string, token1_address: string): Promise<{
    data: {
        token0: string;
        symbol0: string;
        remain0: string;
        token1: string;
        symbol1: string;
        remain1: string;
    };
}>;
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
export declare function getTokenValue(type: "token0" | "token1", token0_address: string, token1_address: string, priceLower: number, priceCurrent: number, priceUpper: number, amount: number): Promise<{
    amount: number;
}>;
/**
 * 拿tick上的价格
 * @param token0_address
 * @param token1_address
 * @param price
 * @returns
 */
export declare function getCloseToTickPrice(token0_address: string, token1_address: string, price: number): Promise<number>;
/**
 * 对token授权
 * @param token_address
 * @param type
 * @param callback
 */
export declare function approveToken(token_address: string, type: "deposit" | "ivest", callback: (code: number, hash: string) => void): Promise<void>;
/**
 * deposit买入
 * @param token_address
 * @param amount
 * @param callback
 */
export declare function deposit(token_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * withdraw 提出
 * @param token_address
 * @param amount
 * @param callback
 */
export declare function withdraw(token_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
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
export declare function invest(token0_address: string, token1_address: string, fee: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * 追加
 * @param token0_address
 * @param token1_address
 * @param id
 * @param amount0
 * @param amount1
 * @param callback
 */
export declare function addInvest(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, callback: (code: number, hash: string) => void): Promise<void>;
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
export declare function switching(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, hedge: boolean, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * 撤资
 * @param id
 * @param isclose
 * @param callback
 */
export declare function divest(id: string, isclose: boolean, callback: (code: number, hash: string) => void): void;
export declare function divest1(id: string, callback: (code: number, hash: string) => void): void;
/**
 * 创建账号（投资前先创建）
 * @param callback
 */
export declare function createAccount(callback: (code: number, hash: string) => void): void;
/**
 * test
 * @param callback
 */
export declare function test(callback: (code: number, hash: string) => void): Promise<void>;
