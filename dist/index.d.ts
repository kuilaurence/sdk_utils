export declare var web3: any;
export declare var useinfo: {
    account: string;
    chainID: string;
};
/**
 * 大数转常数
 * @param number 大数
 * @param decimals 精度(可选)
 * @returns string
 */
export declare function convertBigNumberToNormal(number: string, decimals?: number): string;
/**
 * 常数转大数
 * @param number 常数
 * @param decimals 精度(选填)
 * @param fix 截取(选填)
 * @returns string
 */
export declare function convertNormalToBigNumber(number: string, decimals?: number, fix?: number): string;
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns string
 */
export declare function calculatePercentage(numerator: string, denominator: string): string;
/**
 * multipliedBy
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function calculateMultiplied(number1: string, number2: string): string;
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function minusBigNumber(number1: string, number2: string): string;
/**
 * 加 x+y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function add(number1: string, number2: string): string;
/**
 * 减 x-y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function sub(number1: string, number2: string): string;
/**
 * 乘 x*y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function mul(number1: string, number2: string): string;
/**
 * 除  x/y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function div(number1: string, number2: string): string;
/**
 * deadline
 * @param delay time
 * @returns timestemp
 */
export declare function getDeadLine(delay: number): number;
interface DictObject {
    [key: string]: string;
}
/**
 * 通过value找key
 * @param obj 对象
 * @param value value
 * @param compare 比较(可选)
 * @returns key
 */
export declare function findToken(obj: DictObject, value: string, compare?: (a: string, b: string) => boolean): string;
/**
 * 判断是否为以太坊地址
 * @param token_address 地址
 * @returns bool
 */
export declare function isETHAddress(token_address: string): Promise<boolean>;
/**
 * 查币的余额
 * @param token_address 币地址
 * @returns 余额 常数
 */
export declare function getBalance(token_address: string): Promise<string>;
/**
 * 转账
 * @param token_address 币地址
 * @param to_address 收款地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export declare function transfer(token_address: string, to_address: string, amount: string, callback: any): Promise<void>;
/**
 * 从**转账
 * @param token_address 币的地址
 * @param from_address 出账地址
 * @param to_address 入账地址
 * @param amount 数量 常数
 * @param callback 回调
 */
export declare function transferFrom(token_address: string, from_address: string, to_address: string, amount: string, callback: any): Promise<void>;
export declare function getDecimal(token_address: string): Promise<any>;
/**
 * approve Token
 * @param token_address 币地址
 * @param destina_address 目标地址
 * @param callback 回调
 */
export declare function approveToken(token_address: string, destina_address: string, callback: any): Promise<void>;
/**
 * 执行合约
 * @param contract 合约
 * @param methodName 方法
 * @param value value
 * @param params 参数
 * @param callback 回调
 */
export declare function executeContract(contract: any, methodName: string, value: number, params: any, callback: any): void;
/**
 * 链接metamask
 * @param callback 切链换账号的回调
 * @returns 首次连接的返回
 */
export declare function connect(callback: any): Promise<{
    account: string;
    currentChainID: string;
    message: string;
}>;
export {};
