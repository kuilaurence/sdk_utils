import Web3 from "web3";
export declare var web3: Web3;
import { Contract } from "web3-eth-contract";
export declare function convertBigNumberToNormal(number: string, decimals?: number): string;
export declare function convertNormalToBigNumber(number: string, decimals?: number, fix?: number): string;
export declare function calculatePercentage(numerator: string, denominator: string): string;
export declare function calculateMultiplied(number1: string, number2: string): string;
export declare function minusBigNumber(number1: string, number2: string): string;
export declare function add(number1: string, number2: string): string;
export declare function sub(number1: string, number2: string): string;
export declare function mul(number1: string, number2: string): string;
export declare function div(number1: string, number2: string): string;
export declare function getDeadLine(delay: number): number;
export declare const sleep: (ms: number) => Promise<unknown>;
interface DictObject {
    [key: string]: string;
}
export declare function findToken(obj: DictObject, value: string, compare?: (a: string, b: string) => boolean): string | undefined;
export declare function isETHAddress(token_address: string): Promise<boolean>;
export declare function getBalance(token_address: string): Promise<string>;
export declare function transfer(token_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
export declare function transferFrom(token_address: string, from_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
export declare function getDecimal(token_address: string): Promise<any>;
export declare function approveToken(token_address: string, destina_address: string, callback: (code: number, hash: string) => void): Promise<void>;
export declare function getAllowance(token_address: string, destina_address: string): Promise<string>;
export declare function executeContract(contract: Contract, methodName: string, value: number, params: string[], callback: (code: number, hash: string) => void): void;
export declare function connect(walletName: "walletconnect" | "metamask" | "huobiwallet" | "mathwallet" | "tokenpocket", callback: (data: {
    account: string;
    chainID: number;
    chain: string;
    message: string;
}) => void): Promise<{
    account: string;
    chainID: number;
    chain: string;
    message: string;
}>;
export declare function logout(): {
    account: string;
    chainID: number;
    chain: string;
    message: string;
};
export declare function toPrecision(str: string): string;
export {};
