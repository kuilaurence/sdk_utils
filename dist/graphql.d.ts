export declare function getprice(token0_address: string, token1_address: string, tick: number): {
    data: {
        price0: string;
        price1: string;
    };
};
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
 * 获取strategy
 * @returns
 */
export declare function strategyEntities(): Promise<any>;
export declare function calculatetoken0token1(tickLower: number, tickCurrent: number, tickUpper: number, lp: number, sqrtPrice: number, token0Price: number): {
    token0amount: number;
    token1amount: number;
    totalvalue: number;
    token0Ratio: number;
    token1Ratio: number;
    sumLiquidity: number;
};
/**
 * token列表
 * @returns
 */
export declare function getTokenList(): Promise<void | []>;
/**
 *
 * @returns
 */
export declare function getPoolPrice(): Promise<any>;
/**
 * 获取池子的tvl 24h
 * @returns
 */
export declare function getDayTvl(): Promise<{
    data: {
        tvlUSD: number;
        volumeUSD: number;
    };
}>;
/**
 * 风险图表
 * @param sid
 * @returns
 */
export declare function riskManagement(sid: string): Promise<{
    data: {
        unbalanced0: any;
        unbalanced1: any;
        hedgingPrice: number;
        switchEntities: any;
    };
}>;
/**
 * 拿performance图表数据
 * @param sid
 * @returns
 */
export declare function performance(sid: string): Promise<{
    data: {
        creattimestamp: any;
        accumulativefees0: any;
        accumulativefees1: any;
        annualfee: number;
        collectEntities: any;
    };
}>;
/**
 * 池子价格变化
 * @returns
 */
export declare function getPoolHourPrices(poolAddress: string, timestame: string): Promise<{
    poolHourDatas: any;
}>;
/**
 * 建仓时间
 * @param sid
 * @returns
 */
export declare function getCreatStrategyinfo(sid: string): Promise<{
    switchingdetail: any;
}>;
/**
 * 分析report图表数据
 * @param sid
 */
export declare function report(poolAddress: string, sid: string): Promise<{
    data: {
        day24hswitchcount: number;
        totalswitchcount: number;
        result: any;
    };
}>;
