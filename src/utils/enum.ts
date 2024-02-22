export enum ROUTES {
  MAIN = "/",
  LOGIN = "/login",
  MY_TOKENS = "/my-tokens",
  TOKEN_MINT = "/create-token",
  TOKEN_TRANSFER = "/token-transfer",
  TOKEN_MINT_BURN = "/mint-burn-token",
  TOKEN_DETAILS = "/coin/:id",
  TOKENOMICS_CREATE = "",
  TOKENOMICS_MANAGE = "",
  NFT_CREATE = "/create-nfts",
  NFT_LIST = "/list-nft",
  NFT_DETAILS = "/list-nft/:id",
  CREATE_COLLECTION = "/create-collection",
  CREATE_RAFFLE = "/create-raffle",
  JOIN_RAFFLE = "/join-raffle",
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
}

export enum NFT_PAGES {
  CREATE_COLLECTION = "CREATE COLLECTION",
  NFT_CREATE = "CREATE NFT",
  NFT_LIST = "LIST NFTs",
}

export enum RAFFLE_PAGES {
  CREATE_RAFFLE = "CREATE RAFFLE",
  JOIN_RAFFLE = "JOIN RAFFLE",
}

export enum PERIOD {
  "Minute" = 60000,
  "Hour" = 3600000,
  "Day" = 86400000,
  "Week" = 604800000,
  "Month" = 2629800000,
  "Year" = 31557600000,
}
