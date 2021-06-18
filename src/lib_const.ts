export const chainIdDict = {
  1: "Ethereum",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
  56: "BSC",
  97: "BSCTest",
  128: "HECO",
  336: "MULTEST"
};

export const userInfo: { account: string, chainID: 1 | 4 | 97 | 128 | 336, chain: "Ethereum" | "Rinkeby" | "BSCTest" | "HECO" | "MULTEST" } = {
  account: "",
  chainID: 1,
  chain: "Ethereum",
};
//每次部署需要配置,对应合约地址
export const ContractAddress = {
  1: {
    mulBank: "0x9971Fe3E3b12914f5fD606F327216f5A46919dAc",
    mulWork: "0xB9Ab52681857a8CC040d877A0263dF2DB0Ab4bbc",
    v3strategy: "0xf2f1a5272eFc78f4d09116c0f1117B8daF43c7e2",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
    v3gql: "https://graph.multiple.fi/subgraphs/name/multiple/v3",
    strateggql: "https://graph.multiple.fi/subgraphs/name/multiple/graph-playground",
  },
  4: {
    mulBank: "0x9971Fe3E3b12914f5fD606F327216f5A46919dAc",
    mulWork: "0xB9Ab52681857a8CC040d877A0263dF2DB0Ab4bbc",
    v3strategy: "0xf2f1a5272eFc78f4d09116c0f1117B8daF43c7e2",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
    v3gql: "https://graph.multiple.fi/subgraphs/name/multiple/v3",
    strateggql: "https://graph.multiple.fi/subgraphs/name/multiple/graph-playground",
  },
  97: {
    mulBank: "0x9971Fe3E3b12914f5fD606F327216f5A46919dAc",
    mulWork: "0xB9Ab52681857a8CC040d877A0263dF2DB0Ab4bbc",
    v3strategy: "0xf2f1a5272eFc78f4d09116c0f1117B8daF43c7e2",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
    v3gql: "https://graph.multiple.fi/subgraphs/name/multiple/v3",
    strateggql: "https://graph.multiple.fi/subgraphs/name/multiple/graph-playground",
  },
  128: {
    mulBank: "0x9971Fe3E3b12914f5fD606F327216f5A46919dAc",
    mulWork: "0xB9Ab52681857a8CC040d877A0263dF2DB0Ab4bbc",
    v3strategy: "0xf2f1a5272eFc78f4d09116c0f1117B8daF43c7e2",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
    v3gql: "https://graph.multiple.fi/subgraphs/name/multiple/v3",
    strateggql: "https://graph.multiple.fi/subgraphs/name/multiple/graph-playground",
  },
  336: {
    mulBank: "0x9971Fe3E3b12914f5fD606F327216f5A46919dAc",
    mulWork: "0xB9Ab52681857a8CC040d877A0263dF2DB0Ab4bbc",
    v3strategy: "0xf2f1a5272eFc78f4d09116c0f1117B8daF43c7e2",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
    v3gql: "https://graph.multiple.fi/subgraphs/name/multiple/v3",
    strateggql: "https://graph.multiple.fi/subgraphs/name/multiple/graph-playground",
  },
};

//每次部署需要配置,普通币的地址
export const tokenAddres = {
  1: {
    USDC: "0x751290426902f507a9c0c536994b0f3997855BA0",
    ETH: "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a",
  },
  4: {
    USDC: "0x751290426902f507a9c0c536994b0f3997855BA0",
    ETH: "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a",
  },
  97: {
    USDC: "0x751290426902f507a9c0c536994b0f3997855BA0",
    ETH: "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a",
  },
  128: {
    USDC: "0x751290426902f507a9c0c536994b0f3997855BA0",
    ETH: "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a",
  },
  336: {
    USDC: "0x751290426902f507a9c0c536994b0f3997855BA0",
    ETH: "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a",
  }
};