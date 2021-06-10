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
export declare function getPositionInfo(poolAddress: string): Promise<{
    data: {
        ticks: {
            tvlToken0: number;
            tvlToken1: number;
        }[];
        poolInfo: any;
        ethPriceUSD: any;
    };
}>;
/**
 * 填写pool地址
 * @param poolAddress
 * @returns
 */
export declare function getPositionInfo2(poolAddress: string): Promise<{
    poolInfo: any;
    ethPriceUSD: any;
}>;
/**
 * token列表
 * @returns
 */
export declare function getTokenList(): Promise<void | []>;
