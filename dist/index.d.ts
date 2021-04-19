import { logout as _logout, connect as _connect, getBalance as _getBalance, approveToken as _approveToken, isETHAddress as _isETHAddress } from "./lib.utils";
export declare const logout: typeof _logout;
export declare const connect: typeof _connect;
export declare const getBalance: typeof _getBalance;
export declare const approveToken: typeof _approveToken;
export declare const isETHAddress: typeof _isETHAddress;
export declare var tokenDic: {};
export declare var rankList: {
    data: [];
};
/**
 * 获取symbol
 * @param token_address
 * @returns
 */
export declare function getTokenSymbol(token_address: string): string;
/**
 * 获取授权值   type  buy  //币的名字
 * @param token_address
 * @param type
 * @returns
 */
export declare function getAllowance(token_address: string, type: string): Promise<string>;
/**
 * 获得approvetoken address
 * @param token_symbol
 * @returns
 */
export declare function getApproveTokens(token_symbol: string): string;
/**
 * 是否绑定上级
 * @returns
 */
export declare function GetIntroducerBind(): Promise<any>;
/**
 * 奖励页面
 * @returns
 */
export declare function queryInvite(): Promise<{
    data: {
        firstLevelCount: any;
        firstLevelAmount: string;
        secondLevelCount: any;
        secondLevelAmount: string;
        reward: string;
    };
}>;
export declare function getNodeInfo(): Promise<{
    data: {
        totalvalue: string;
        totalContribution: string;
        amount: string;
        reward: string;
    };
}>;
/**
 * farming页面信息
 * @returns
 */
export declare function farmingInfo(): Promise<{
    data: {
        ETHPrice: number;
        ETHSTLockAmount: string;
        ETHST: {
            totalAmount: number;
            userAmount: string;
            ethIncome: string;
            ethTotalIncome: string;
            etIncome: string;
            etTotalIncome: string;
            apy: number;
        };
        ETHSTUSDT: {
            totalAmount: number;
            userAmount: string;
            etIncome: string;
            etTotalIncome: string;
            apy: number;
        };
        ETUSDT: {
            totalAmount: number;
            userAmount: string;
            etIncome: string;
            etTotalIncome: string;
            apy: number;
        };
    };
}>;
/**
 * 获取信息
 * @returns
 */
export declare function getCurrentRecord(): Promise<{
    data: {
        total: string;
        sellTotal: string;
        buyTotal: string;
    };
}>;
/**
 * 首页
 * @returns
 */
export declare function homeData(): Promise<{
    data: {
        ETHSTprice: number;
        ETprice: number;
        network: {
            ETHST_total: string;
            ETHST_circulation: string;
            ET_total: string;
            ET_circulation: string;
            ETH_release: string;
        };
        my: {
            ETHST_balance: string;
            ETHST_pledge: string;
            ET_balance: string;
            ETH_user_release: string;
        };
    };
}>;
/**
 * 信息
 * @returns
 */
export declare function homeData2(): Promise<{
    data: {
        ETHSTLockAmount: string;
        ETHST_total: string;
        ETHPrice: number;
        ETprice: number;
    };
}>;
/**
 * 买ETHST
 * @param _amount
 * @param husdEthstRatio
 * @param id
 * @param callback
 */
export declare function buy(_amount: string, husdEthstRatio: string, id: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * 提现
 * @param address
 * @param callback
 */
export declare function API_BindEx(address: string, callback: (code: number, hash: string) => void): void;
/**
 * 提取邀请奖励
 * @param callback
 */
export declare function withdrawBindReward(callback: (code: number, hash: string) => void): void;
/**
 * 提取节点奖励
 * @param callback
 */
export declare function withdrawNodeReward(callback: (code: number, hash: string) => void): void;
/**
 * 质押ETHST
 * @param type
 * @param amount
 * @param callback
 */
export declare function stake(type: string, amount: string, callback: (code: number, hash: string) => void): void;
/**
 * 移除ETHST
 * @param type
 * @param amount
 * @param callback
 */
export declare function remove(type: string, amount: string, callback: (code: number, hash: string) => void): void;
/**
 * 收取et
 * @param type
 * @param callback
 */
export declare function harvestET(type: string, callback: (code: number, hash: string) => void): void;
/**
 * 提取eth
 * @param callback
 */
export declare function withdraw_ETH(callback: (code: number, hash: string) => void): void;
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
