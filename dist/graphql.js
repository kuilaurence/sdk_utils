var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getTokenSymbol } from "./index";
import { userInfo } from "./lib_const";
import { convertBigNumberToNormal } from "./lib.utils";
import { tickToPrice } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { getV3LP } from "./api2";
function getprice(token0_address, token1_address, tick) {
    var token0 = new Token(1, token0_address, 6); //usdt
    var token1 = new Token(1, token1_address, 18); //eth
    var price0 = tickToPrice(token0, token1, tick).toFixed(4);
    var price1 = tickToPrice(token1, token0, tick).toFixed(4);
    // console.log("--------", priceToClosestTick(new Price(token0, token1, 2643.5847 * 1e6, 1e18)));
    return {
        data: {
            price0: price0,
            price1: price1,
        }
    };
}
var tokenList;
var graphql = "https://api.thegraph.com/subgraphs/name/winless/multiple";
var playground = "http://120.92.137.203:9002/subgraphs/name/multiple/graph";
/**
 * 拿投资列表
 * @returns
 */
export function getinvestList() {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = "\n      {\n        positions(where:{user:\"" + userInfo.account + "\"}) {\n          id\n          user\n          positionId\n          token0\n          token1\n          debt0\n          debt1\n          exit0\n          exit1\n          liquidity\n          tickLower\n          tickUpper\n          close\n          }\n        }\n      ";
            return [2 /*return*/, fetch(graphql, {
                    method: "post",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ query: query }),
                }).then(function (response) { return response.json(); })
                    .then(function (data) {
                    var history = data.data.positions;
                    return {
                        data: history.map(function (item) {
                            return __assign(__assign({}, item), { debt0: convertBigNumberToNormal(item.debt0, 18), debt1: convertBigNumberToNormal(item.debt1, 18), priceLower: Math.pow(1.0001, item.tickLower), priceUpper: Math.pow(1.0001, item.tickUpper), symbol0: getTokenSymbol(item.token0), symbol1: getTokenSymbol(item.token1) });
                        }),
                    };
                })
                    .catch(function () {
                    return { data: [] };
                })];
        });
    });
}
/**
 * 获取池子信息
 * @returns
 */
export function getPositionInfo(poolAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getV3LP()];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, getPositionInfo2(poolAddress)];
                case 2:
                    res2 = _a.sent();
                    return [2 /*return*/, {
                            data: {
                                ticks: res,
                                poolInfo: res2.poolInfo,
                                ethPriceUSD: res2.ethPriceUSD,
                            }
                        }];
            }
        });
    });
}
/**
 * 填写pool地址
 * @param poolAddress
 * @returns
 */
export function getPositionInfo2(poolAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = "\n    {\n        bundles {\n          ethPriceUSD\n        }\n        pool(id: \"0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e\") {\n            id\n            feeTier\n            liquidity\n            sqrtPrice\n            tick\n            token0 {\n              id\n              symbol\n              name\n              decimals\n              derivedETH\n            }\n            token1 {\n              id\n              symbol\n              name\n              decimals\n              derivedETH\n            }\n            token0Price\n            token1Price\n            volumeUSD\n            txCount\n            totalValueLockedToken0\n            totalValueLockedToken1\n            totalValueLockedUSD\n        }\n        ticks(first: 1000, skip: 0, where: {poolAddress: \"0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e\", tickIdx_lte: 210300, tickIdx_gte: 186300}) {\n          tickIdx\n          liquidityGross\n          liquidityNet\n          price0\n          price1\n        }\n      }\n      ";
            return [2 /*return*/, fetch(playground, {
                    method: "post",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ query: query }),
                }).then(function (response) { return response.json(); })
                    .then(function (data) {
                    var ethPriceUSD = data.data.bundles[0].ethPriceUSD;
                    var poolInfo = data.data.pool;
                    return {
                        poolInfo: poolInfo,
                        ethPriceUSD: ethPriceUSD,
                    };
                })];
        });
    });
}
/**
 * token列表
 * @returns
 */
export function getTokenList() {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = "\n    {\n        tokens {\n          id\n          symbol\n          decimals\n        }\n    }\n    ";
            return [2 /*return*/, fetch(playground, {
                    method: "post",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ query: query }),
                }).then(function (response) { return response.json(); })
                    .then(function (data) {
                    tokenList = data.data.tokens;
                    console.log(tokenList);
                    return tokenList;
                })
                    .catch(function () {
                    tokenList = [];
                })];
        });
    });
}
//# sourceMappingURL=graphql.js.map