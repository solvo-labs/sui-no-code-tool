export enum ROUTES {
  MAIN = "/",
  LOGIN = "/login",
  MY_TOKENS = "/my-tokens",
  TOKEN_MINT = "/create-token",
  TOKEN_TRANSFER = "/token-transfer",
  TOKEN_MINT_BURN = "/mint-burn-token",
  TOKENOMICS_CREATE = "",
  TOKENOMICS_MANAGE = "",
  NFT_CREATE = "/create-nfts",
  NFT_LIST = "/list-nft",
  NFT_DETAILS = "/list-nft/:id",
}

export enum TOPBAR_PAGES {
  TOKEN = "Token",
  TOKENOMICS = "Tokenomics",
  NFT = "NFT",
  STAKE = "Stake",
}

export enum TOKEN_PAGES {
  MY_TOKENS = "MY TOKENS",
  TOKEN_MINT = "TOKEN MINT",
  TOKEN_TRANSFER = "TRANSFER",
  TOKEN_MINT_BURN = "MINT & BURN",
}

export enum TOKENOMICS_PAGE {
  TOKENOMICS_CREATE = "CREATE TOKENOMICS",
  TOKENOMICS_MANAGE = "MANAGE TOKENOMICS",
}

export enum NFT_PAGE {
  NFT_CREATE = "CREATE NFT",
  NFT_LIST = "LIST NFTs",
}
