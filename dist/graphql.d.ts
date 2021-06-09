/**
 * 拿投资列表
 * @returns
 */
export declare function getinvestList(): Promise<void | {
    data: any;
}>;
/**
 * 获取池子信息
 * @returns
 */
export declare function getPositionInfo(): Promise<void>;
/**
 * 获取tokens
 * @returns
 */
export declare function getTokenList(): Promise<void | []>;
