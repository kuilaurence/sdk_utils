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
    mulBank: "0xC3818931b5a64dd9BE59BAac51ffE046cbe28012",
    mulWork: "0xaBf38DBE035DBBc23d0c63Af5d05Ad7dBfCAE874",
    v3strategy: "0x695535a2612Cf1b1420b99079F750AE4fff79CB8",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
  },
  4: {
    mulBank: "0xC3818931b5a64dd9BE59BAac51ffE046cbe28012",
    mulWork: "0xaBf38DBE035DBBc23d0c63Af5d05Ad7dBfCAE874",
    v3strategy: "0x695535a2612Cf1b1420b99079F750AE4fff79CB8",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
  },
  97: {
    mulBank: "0xC3818931b5a64dd9BE59BAac51ffE046cbe28012",
    mulWork: "0xaBf38DBE035DBBc23d0c63Af5d05Ad7dBfCAE874",
    v3strategy: "0x695535a2612Cf1b1420b99079F750AE4fff79CB8",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
  },
  128: {
    mulBank: "0xC3818931b5a64dd9BE59BAac51ffE046cbe28012",
    mulWork: "0xaBf38DBE035DBBc23d0c63Af5d05Ad7dBfCAE874",
    v3strategy: "0x695535a2612Cf1b1420b99079F750AE4fff79CB8",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
  },
  336: {
    mulBank: "0xC3818931b5a64dd9BE59BAac51ffE046cbe28012",
    mulWork: "0xaBf38DBE035DBBc23d0c63Af5d05Ad7dBfCAE874",
    v3strategy: "0x695535a2612Cf1b1420b99079F750AE4fff79CB8",
    v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
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