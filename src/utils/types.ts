export type TokenForm = {
  name: string;
  symbol: string;
  decimal: number;
  asset: string;
  description: string;
};

export type NftForm = {
  name: string;
  symbol: string;
  asset: string;
};

export type NftObject = {
  data: {
    content: {
      dataType: string;
      fields: {
        name: string;
        url: string;
        description: string;
      };
      hasPublicTransfer: boolean;
    };
    objectId: string;
    owner: string;
    previousTransaction: string;
    storageRebate: string;
    type: string;
    version: string;
  };
};
