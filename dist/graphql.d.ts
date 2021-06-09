/**
 * 拿投资列表
 * @returns
 */
export declare function getinvestList(): Promise<{
    data: any;
} | {
    data: never[];
}>;
/**
 * 获取池子信息
 * @returns
 */
export declare function getPositionInfo(): Promise<{
    data: {
        ticks: {
            tvlToken0: number;
            tvlToken1: number;
        }[];
    };
}>;
export declare function getPositionInfo2(): Promise<{
    data: {
        ticks: any;
        poolInfo: any;
        ethPriceUSD: any;
    };
} | {
    data: never[];
}>;
/**
 * token列表
 * @returns
 */
export declare function getTokenList(): Promise<void | []>;
