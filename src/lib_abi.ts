import { AbiItem } from "web3-utils";

import { erc20 } from "./raw/erc20.js";
import { lpmining } from "./raw/lpmining.js";
import { Recommend } from "./raw/Recommend.js";
import { NodeMining } from "./raw/NodeMining.js";
import { InviteReward } from "./raw/InviteReward.js";
import { PledgeMining } from "./raw/PledgeMining.js";
import { ExchangeToken } from "./raw/ExchangeToken.js";
import { FixedSupplyToken } from "./raw/FixedSupplyToken.js";
import { etquery } from "./raw/etquery.js";

export const ERC20 = erc20 as AbiItem[];
export const LPMINING = lpmining as AbiItem[];
export const RECOMMEND = Recommend as AbiItem[];
export const NODEMINING = NodeMining as AbiItem[];
export const INVITEREWARD = InviteReward as AbiItem[];
export const PLEDGEMINING = PledgeMining as AbiItem[];
export const EXCHANGETOKEN = ExchangeToken as AbiItem[];
export const FIXEDSUPPLYTOKEN = FixedSupplyToken as AbiItem[];
export const ETQUERY = etquery as AbiItem[];
