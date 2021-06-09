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
import JSBI from "jsbi";
import keyBy from "lodash.keyby";
import { TickMath, tickToPrice, Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { BigNumber } from "@ethersproject/bignumber";
var PRICE_FIXED_DIGITS = 4;
var DEFAULT_SURROUNDING_TICKS = 300;
var MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);
var FEE_TIER_TO_TICK_SPACING = function (feeTier) {
    switch (feeTier) {
        case "10000":
            return 200;
        case "3000":
            return 60;
        case "500":
            return 10;
        default:
            throw Error("Tick spacing for fee tier " + feeTier + " undefined.");
    }
};
var playground = "http://120.92.137.203:9002/subgraphs/name/multiple/graph";
var fetchData = function (query) {
    return fetch(playground, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query: query }),
    }).then(function (response) { return response.json(); });
};
var fetchInitializedTicks = function () {
    var query = "\n        query {\n          ticks(first: 1000, skip: 0, where: {poolAddress: \"0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e\", tickIdx_lte: 210300, tickIdx_gte: 186300}) {\n            tickIdx\n            liquidityGross\n            liquidityNet\n            price0\n            price1\n          }\n        }\n        ";
    return fetchData(query);
};
var fetchPools = function () {
    var query = "\n         query {\n            pool(id: \"0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e\") {\n            tick\n            token0 {\n                symbol\n                id\n                decimals\n            }\n            token1 {\n                symbol\n                id\n                decimals\n            }\n            feeTier\n            sqrtPrice\n            liquidity\n            }\n\n         }\n  ";
    return fetchData(query);
};
export var fetchTicksSurroundingPrice = function (numSurroundingTicks) {
    if (numSurroundingTicks === void 0) { numSurroundingTicks = DEFAULT_SURROUNDING_TICKS; }
    return __awaiter(void 0, void 0, void 0, function () {
        var result1, poolResult, _a, poolCurrentTick, feeTier, liquidity, _b, token0Address, token0Decimals, _c, token1Address, token1Decimals, poolCurrentTickIdx, tickSpacing, activeTickIdx, tickIdxLowerBound, tickIdxUpperBound, initializedTicksResult, initializedTicks, tickIdxToInitializedTick, token0, token1, activeTickIdxForPrice, activeTickProcessed, activeTick, Direction, computeSurroundingTicks, subsequentTicks, previousTicks, ticksProcessed;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetchPools()];
                case 1:
                    result1 = _d.sent();
                    poolResult = result1.data;
                    _a = poolResult.pool, poolCurrentTick = _a.tick, feeTier = _a.feeTier, liquidity = _a.liquidity, _b = _a.token0, token0Address = _b.id, token0Decimals = _b.decimals, _c = _a.token1, token1Address = _c.id, token1Decimals = _c.decimals;
                    poolCurrentTickIdx = parseInt(poolCurrentTick);
                    tickSpacing = FEE_TIER_TO_TICK_SPACING(feeTier);
                    activeTickIdx = Math.floor(poolCurrentTickIdx / tickSpacing) * tickSpacing;
                    tickIdxLowerBound = activeTickIdx - numSurroundingTicks * tickSpacing;
                    tickIdxUpperBound = activeTickIdx + numSurroundingTicks * tickSpacing;
                    return [4 /*yield*/, fetchInitializedTicks()];
                case 2:
                    initializedTicksResult = _d.sent();
                    initializedTicks = initializedTicksResult.data.ticks;
                    tickIdxToInitializedTick = keyBy(initializedTicks, "tickIdx");
                    token0 = new Token(1, token0Address, parseInt(token0Decimals));
                    token1 = new Token(1, token1Address, parseInt(token1Decimals));
                    activeTickIdxForPrice = activeTickIdx;
                    if (activeTickIdxForPrice < TickMath.MIN_TICK) {
                        activeTickIdxForPrice = TickMath.MIN_TICK;
                    }
                    if (activeTickIdxForPrice > TickMath.MAX_TICK) {
                        activeTickIdxForPrice = TickMath.MAX_TICK;
                    }
                    activeTickProcessed = {
                        liquidityActive: JSBI.BigInt(liquidity),
                        tickIdx: activeTickIdx,
                        liquidityNet: JSBI.BigInt(0),
                        price0: tickToPrice(token0, token1, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
                        price1: tickToPrice(token1, token0, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
                        liquidityGross: JSBI.BigInt(0),
                    };
                    activeTick = tickIdxToInitializedTick[activeTickIdx];
                    if (activeTick) {
                        activeTickProcessed.liquidityGross = JSBI.BigInt(activeTick.liquidityGross);
                        activeTickProcessed.liquidityNet = JSBI.BigInt(activeTick.liquidityNet);
                    }
                    (function (Direction) {
                        Direction[Direction["ASC"] = 0] = "ASC";
                        Direction[Direction["DESC"] = 1] = "DESC";
                    })(Direction || (Direction = {}));
                    computeSurroundingTicks = function (activeTickProcessed, tickSpacing, numSurroundingTicks, direction) {
                        var previousTickProcessed = __assign({}, activeTickProcessed);
                        // Iterate outwards (either up or down depending on 'Direction') from the active tick,
                        // building active liquidity for every tick.
                        var processedTicks = [];
                        for (var i = 0; i < numSurroundingTicks; i++) {
                            var currentTickIdx = direction == Direction.ASC
                                ? previousTickProcessed.tickIdx + tickSpacing
                                : previousTickProcessed.tickIdx - tickSpacing;
                            if (currentTickIdx < TickMath.MIN_TICK ||
                                currentTickIdx > TickMath.MAX_TICK) {
                                break;
                            }
                            var currentTickProcessed = {
                                liquidityActive: previousTickProcessed.liquidityActive,
                                tickIdx: currentTickIdx,
                                liquidityNet: JSBI.BigInt(0),
                                price0: tickToPrice(token0, token1, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
                                price1: tickToPrice(token1, token0, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
                                liquidityGross: JSBI.BigInt(0),
                            };
                            // Check if there is an initialized tick at our current tick.
                            // If so copy the gross and net liquidity from the initialized tick.
                            var currentInitializedTick = tickIdxToInitializedTick[currentTickIdx.toString()];
                            if (currentInitializedTick) {
                                currentTickProcessed.liquidityGross = JSBI.BigInt(currentInitializedTick.liquidityGross);
                                currentTickProcessed.liquidityNet = JSBI.BigInt(currentInitializedTick.liquidityNet);
                            }
                            // Update the active liquidity.
                            // If we are iterating ascending and we found an initialized tick we immediately apply
                            // it to the current processed tick we are building.
                            // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
                            if (direction == Direction.ASC && currentInitializedTick) {
                                currentTickProcessed.liquidityActive = JSBI.add(previousTickProcessed.liquidityActive, JSBI.BigInt(currentInitializedTick.liquidityNet));
                            }
                            else if (direction == Direction.DESC &&
                                JSBI.notEqual(previousTickProcessed.liquidityNet, JSBI.BigInt(0))) {
                                // We are iterating descending, so look at the previous tick and apply any net liquidity.
                                currentTickProcessed.liquidityActive = JSBI.subtract(previousTickProcessed.liquidityActive, previousTickProcessed.liquidityNet);
                            }
                            processedTicks.push(currentTickProcessed);
                            previousTickProcessed = currentTickProcessed;
                        }
                        if (direction == Direction.DESC) {
                            processedTicks = processedTicks.reverse();
                        }
                        return processedTicks;
                    };
                    subsequentTicks = computeSurroundingTicks(activeTickProcessed, tickSpacing, numSurroundingTicks, Direction.ASC);
                    previousTicks = computeSurroundingTicks(activeTickProcessed, tickSpacing, numSurroundingTicks, Direction.DESC);
                    ticksProcessed = previousTicks
                        .concat(activeTickProcessed)
                        .concat(subsequentTicks);
                    return [2 /*return*/, {
                            data: {
                                ticksProcessed: ticksProcessed,
                                feeTier: feeTier,
                                tickSpacing: tickSpacing,
                                activeTickIdx: activeTickIdx,
                            },
                        }];
            }
        });
    });
};
export var getV3LP = function () { return fetchTicksSurroundingPrice()
    .then(function (res) {
    return formatData(res.data);
}); };
var token1 = new Token(1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 18);
var token0 = new Token(1, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 6);
function formatData(poolTickData) {
    return __awaiter(this, void 0, void 0, function () {
        var newData;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(poolTickData.ticksProcessed.map(function (t, i) { return __awaiter(_this, void 0, void 0, function () {
                        var active, sqrtPriceX96, feeAmount, mockTicks, pool, nextSqrtX96, maxAmountToken0, outputRes0, _a, token1Amount, amount0, amount1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    active = t.tickIdx === poolTickData.activeTickIdx;
                                    sqrtPriceX96 = TickMath.getSqrtRatioAtTick(t.tickIdx);
                                    feeAmount = 3000;
                                    mockTicks = [
                                        {
                                            index: t.tickIdx - 60,
                                            liquidityGross: t.liquidityGross,
                                            liquidityNet: JSBI.multiply(t.liquidityNet, JSBI.BigInt("-1")),
                                        },
                                        {
                                            index: t.tickIdx,
                                            liquidityGross: t.liquidityGross,
                                            liquidityNet: t.liquidityNet,
                                        },
                                    ];
                                    pool = new Pool(token0, token1, 3000, sqrtPriceX96, t.liquidityActive, t.tickIdx, mockTicks);
                                    nextSqrtX96 = poolTickData.ticksProcessed[i - 1]
                                        ? TickMath.getSqrtRatioAtTick(poolTickData.ticksProcessed[i - 1].tickIdx)
                                        : undefined;
                                    maxAmountToken0 = token0
                                        ? CurrencyAmount.fromRawAmount(token0, MAX_UINT128.toString())
                                        : undefined;
                                    if (!(pool && maxAmountToken0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, pool.getOutputAmount(maxAmountToken0, nextSqrtX96)];
                                case 1:
                                    _a = _b.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _a = undefined;
                                    _b.label = 3;
                                case 3:
                                    outputRes0 = _a;
                                    token1Amount = outputRes0 === null || outputRes0 === void 0 ? void 0 : outputRes0[0];
                                    amount0 = token1Amount
                                        ? parseFloat(token1Amount.toExact()) * parseFloat(t.price1)
                                        : 0;
                                    amount1 = token1Amount ? parseFloat(token1Amount.toExact()) : 0;
                                    return [2 /*return*/, {
                                            index: i,
                                            isCurrent: active,
                                            activeLiquidity: parseFloat(t.liquidityActive.toString()),
                                            price0: parseFloat(t.price0),
                                            price1: parseFloat(t.price1),
                                            tvlToken0: amount0,
                                            tvlToken1: amount1,
                                        }];
                            }
                        });
                    }); }))];
                case 1:
                    newData = _a.sent();
                    // offset the values to line off bars with TVL used to swap across bar
                    newData === null || newData === void 0 ? void 0 : newData.map(function (entry, i) {
                        if (i > 0) {
                            newData[i - 1].tvlToken0 = entry.tvlToken0;
                            newData[i - 1].tvlToken1 = entry.tvlToken1;
                        }
                    });
                    return [2 /*return*/, newData];
            }
        });
    });
}
//# sourceMappingURL=api2.js.map