export enum ROUTES {
  MAIN = "/",
  LOGIN = "/login",
  MY_TOKENS = "/my-tokens",
  TOKEN_MINT = "/create-token",
  TOKEN_TRANSFER = "/token-transfer",
  TOKEN_MINT_BURN = "/mint-burn-token",
  TOKEN_DETAILS = "/coin/:id",
  TOKENOMICS_CREATE = "/create-vesting",
  TOKENOMICS_MANAGE = "/manage-vesting",
  TOKENOMICS_LIST = "/list-vesting",
  NFT_CREATE = "/create-nfts",
  NFT_LIST = "/list-nft",
  NFT_DETAILS = "/list-nft/:id",
  CREATE_COLLECTION = "/create-collection",
  CREATE_RAFFLE = "/create-raffle",
  JOIN_RAFFLE = "/join-raffle",
  MANAGE_RAFFLE = "/manage-raffle",
}

export enum TOPBAR_PAGES {
  TOKEN = "Token",
  TOKENOMICS = "Tokenomics",
  NFT = "NFT",
  STAKE = "Stake",
  RAFFLE = "Raffle",
}

export enum TOKEN_PAGES {
  MY_TOKENS = "MY TOKENS",
  TOKEN_MINT = "TOKEN MINT",
  // TOKEN_TRANSFER = "TRANSFER",
  // TOKEN_MINT_BURN = "MINT & BURN",
}

export enum TOKENOMICS_PAGES {
  TOKENOMICS_CREATE = "CREATE TOKENOMICS",
  TOKENOMICS_MANAGE = "MANAGE TOKENOMICS",
  TOKENOMICS_LIST = "LIST TOKENOMICS",
}

export enum NFT_PAGES {
  CREATE_COLLECTION = "CREATE COLLECTION",
  NFT_CREATE = "CREATE NFT",
  NFT_LIST = "LIST NFTs",
}

export enum RAFFLE_PAGES {
  CREATE_RAFFLE = "CREATE RAFFLE",
  JOIN_RAFFLE = "JOIN RAFFLE",
  MANAGE_RAFFLE = "MANAGE RAFFLE",
}

export enum PERIOD {
  "Minute" = 60000,
  "Hour" = 3600000,
  "Day" = 86400000,
  "Week" = 604800000,
  "Month" = 2629800000,
  "Year" = 31557600000,
}

export enum SCHEDULE {
  "Per Second" = 1,
  "Per Minute" = 60,
  "Hourly" = 3600,
  "Daily" = 86400,
  "Weekly" = 604800,
  "Monthly" = 2592000,
  "Quarterly" = 7776000,
  "Yearly" = 31536000,
}
