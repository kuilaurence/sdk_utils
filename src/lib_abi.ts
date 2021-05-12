import { AbiItem } from "web3-utils";

import { erc20 } from "./raw/erc20";
import { mulbank } from "./raw/mulbank";

export const ERC20 = erc20 as AbiItem[];
export const MULBANK = mulbank as AbiItem[];