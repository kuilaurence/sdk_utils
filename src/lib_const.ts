export const chainIdDict = {
  1: "Ethereum",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
  56: "BSC",
  97: "BSCTest",
  128: "HECO",
};

export const userInfo: { account: string, chainID: 1 | 4 | 97 | 128, chain: "Ethereum" | "Rinkeby" | "BSCTest" | "HECO" } = {
  account: "",
  chainID: 1,
  chain: "Ethereum",
};

//每次部署需要配置,对应合约地址
export const ContractAddress = {
  1: {
    mulBank: "0x07dAd2A3d15B780717Bfb1156B6E5306d74cA3fF",
    v3strategy: "0x5b99c265E4dE7E71a7C3987DF61268795517e1bF",
    mulWork: "0x994aA39EAC34882855a2A2fE7a73C2D6a32440fA",
  },
  4: {
    mulBank: "0x07dAd2A3d15B780717Bfb1156B6E5306d74cA3fF",
    v3strategy: "0x5b99c265E4dE7E71a7C3987DF61268795517e1bF",
    mulWork: "0x994aA39EAC34882855a2A2fE7a73C2D6a32440fA",
  },
  97: {
    mulBank: "0x07dAd2A3d15B780717Bfb1156B6E5306d74cA3fF",
    v3strategy: "0x5b99c265E4dE7E71a7C3987DF61268795517e1bF",
    mulWork: "0x994aA39EAC34882855a2A2fE7a73C2D6a32440fA",
  },
  128: {
    mulBank: "0x07dAd2A3d15B780717Bfb1156B6E5306d74cA3fF",
    v3strategy: "0x5b99c265E4dE7E71a7C3987DF61268795517e1bF",
    mulWork: "0x994aA39EAC34882855a2A2fE7a73C2D6a32440fA",
  },
};

//每次部署需要配置,普通币的地址
export const tokenAddres = {
  1: {
    USDT: "0x7F849aA38Fe8988c702B7Fe9828b04e1FDD330a3",
    BTC: "0x409695Ee4FF431cDED2c2427Dc4ffB7958C3D7A5",
  },
  4: {
    USDT: "0x7F849aA38Fe8988c702B7Fe9828b04e1FDD330a3",
    BTC: "0x409695Ee4FF431cDED2c2427Dc4ffB7958C3D7A5",
  },
  97: {
    USDT: "0x7F849aA38Fe8988c702B7Fe9828b04e1FDD330a3",
    BTC: "0x409695Ee4FF431cDED2c2427Dc4ffB7958C3D7A5",
  },
  128: {
    USDT: "0x7F849aA38Fe8988c702B7Fe9828b04e1FDD330a3",
    BTC: "0x409695Ee4FF431cDED2c2427Dc4ffB7958C3D7A5",
  },
};