import JSBI from "jsbi";
export interface TickProcessed {
    liquidityGross: JSBI;
    liquidityNet: JSBI;
    tickIdx: number;
    liquidityActive: JSBI;
    price0: string;
    price1: string;
}
export interface PoolTickData {
    ticksProcessed: TickProcessed[];
    feeTier: string;
    tickSpacing: number;
    activeTickIdx: number;
}
export declare const fetchTicksSurroundingPrice: (numSurroundingTicks?: number) => Promise<{
    data?: PoolTickData;
}>;
export declare const getV3LP: () => Promise<{
    tvlToken0: number;
    tvlToken1: number;
}[]>;
