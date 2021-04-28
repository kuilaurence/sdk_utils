import { logout as _logout, connect as _connect, getBalance as _getBalance, approveToken as _approveToken, isETHAddress as _isETHAddress } from "./lib.utils";
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const logout: typeof _logout;
export declare const connect: typeof _connect;
export declare const getBalance: typeof _getBalance;
export declare const approveToken: typeof _approveToken;
export declare const isETHAddress: typeof _isETHAddress;
export declare var tokenDic: {};
export declare var rankList: {
    data: [];
};
export declare var trace: boolean;
export declare function getTokenSymbol(token_address: string): string;
export declare function getAllowance(token_address: string, type: string): Promise<string>;
export declare function getApproveTokens(token_symbol: string): string;
export declare function GetIntroducerBind(): Promise<any>;
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
export declare function getCurrentRecord(): Promise<{
    data: {
        total: string;
        sellTotal: string;
        buyTotal: string;
    };
}>;
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
export declare function homeData2(): Promise<{
    data: {
        ETHSTLockAmount: string;
        ETHST_total: string;
        ETHPrice: number;
        ETprice: number;
    };
}>;
export declare function buy(_amount: string, husdEthstRatio: string, id: string, callback: (code: number, hash: string) => void): Promise<void>;
export declare function API_BindEx(address: string, callback: (code: number, hash: string) => void): void;
export declare function withdrawBindReward(callback: (code: number, hash: string) => void): void;
export declare function withdrawNodeReward(callback: (code: number, hash: string) => void): void;
export declare function stake(type: string, amount: string, callback: (code: number, hash: string) => void): void;
export declare function remove(type: string, amount: string, callback: (code: number, hash: string) => void): void;
export declare function harvestET(type: string, callback: (code: number, hash: string) => void): void;
export declare function withdraw_ETH(callback: (code: number, hash: string) => void): void;
export declare function test(callback: (code: number, hash: string) => void): Promise<void>;
export declare function networkHashrateInfo(): Promise<any>;
export declare function getRankList(): {
    data: [];
};
export declare function getRankListBefore(): Promise<void>;
