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
    mulBank: "0x9C8002edD58E331965467F9bc67D7853a7d00d9E",
    mulWork: "0xa5d38bC3Ac8909ff967545bc742Bf4216C382bc2",
    v3strategy: "0x0aaBf33f0B6d0FDE41cDF4Bebc977A54BcDcDA33",
    v3pool: "0x305f1af06d3365818554a927340a360aff4ce5f9",
    graphql: "https://api.thegraph.com/subgraphs/name/winless/multiple",
  },
  4: {
    mulBank: "0x9C8002edD58E331965467F9bc67D7853a7d00d9E",
    mulWork: "0xa5d38bC3Ac8909ff967545bc742Bf4216C382bc2",
    v3strategy: "0x0aaBf33f0B6d0FDE41cDF4Bebc977A54BcDcDA33",
    v3pool: "0x305f1af06d3365818554a927340a360aff4ce5f9",
    graphql: "https://api.thegraph.com/subgraphs/name/winless/multiple",
  },
  97: {
    mulBank: "0x9C8002edD58E331965467F9bc67D7853a7d00d9E",
    mulWork: "0xa5d38bC3Ac8909ff967545bc742Bf4216C382bc2",
    v3strategy: "0x0aaBf33f0B6d0FDE41cDF4Bebc977A54BcDcDA33",
    v3pool: "0x305f1af06d3365818554a927340a360aff4ce5f9",
    graphql: "https://api.thegraph.com/subgraphs/name/winless/multiple",
  },
  128: {
    mulBank: "0x9C8002edD58E331965467F9bc67D7853a7d00d9E",
    mulWork: "0xa5d38bC3Ac8909ff967545bc742Bf4216C382bc2",
    v3strategy: "0x0aaBf33f0B6d0FDE41cDF4Bebc977A54BcDcDA33",
    v3pool: "0x305f1af06d3365818554a927340a360aff4ce5f9",
    graphql: "https://api.thegraph.com/subgraphs/name/winless/multiple",
  },
};

//每次部署需要配置,普通币的地址
export const tokenAddres = {
  1: {
    USDC: "0xd5B61730D852780c0E0D2cb04cAdEF7498ab0fab",
    ETH: "0x794aa9dDEF81Fcb4AE1e5bd0eD3664D982C77183",
  },
  4: {
    USDC: "0xd5B61730D852780c0E0D2cb04cAdEF7498ab0fab",
    ETH: "0x794aa9dDEF81Fcb4AE1e5bd0eD3664D982C77183",
  },
  97: {
    USDC: "0xd5B61730D852780c0E0D2cb04cAdEF7498ab0fab",
    ETH: "0x794aa9dDEF81Fcb4AE1e5bd0eD3664D982C77183",
  },
  128: {
    USDC: "0xd5B61730D852780c0E0D2cb04cAdEF7498ab0fab",
    ETH: "0x794aa9dDEF81Fcb4AE1e5bd0eD3664D982C77183",
  },
};