import { Trace, addMetamaskChain as _addMetamaskChain, toPrecision as _toPrecision, logout as _logout, connect as _connect, getBalance as _getBalance, isETHAddress as _isETHAddress } from "./lib.utils";
export declare const T: typeof Trace;
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const logout: typeof _logout;
export declare const connect: typeof _connect;
export declare const getBalance: typeof _getBalance;
export declare const toPrecision: typeof _toPrecision;
export declare const isETHAddress: typeof _isETHAddress;
export declare const addMetamaskChain: typeof _addMetamaskChain;
export declare var rankList: {
    data: [];
};
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
 * @returns
 */
export declare function getAllowance(token_address: string): Promise<string>;
/**
 * 池子存的数量
 * @param token_address
 * @returns
 */
export declare function poolInfo(token_address: string): Promise<{
    data: {
        supplyToken: any;
        shareToken: any;
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
 * 对token授权
 * @param token_address
 * @param callback
 */
export declare function approveToken(token_address: string, callback: (code: number, hash: string) => void): Promise<void>;
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
export declare function withdraw(token_address: string, amount: string, callback: (code: number, hash: string) => void): void;
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
export declare function invest(token0_address: string, token1_address: string, fee: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, callback: (code: number, hash: string) => void): void;
/**
 * 撤资
 * @param id
 * @param callback
 */
export declare function takeProfit(id: string, callback: (code: number, hash: string) => void): void;
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
/**
 * 拿全网算力
 * @returns
 */
export declare function networkHashrateInfo(): Promise<any>;
/**
 * 拿贡献榜单
 * @returns
 */
export declare function getRankList(): {
    data: [];
};
/**
 * 拿贡献榜单预先
 * @returns
 */
export declare function getRankListBefore(): Promise<void>;
