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
    objectId: string;
    content: {
      dataType: string;
      hasPublicTransfer: string;
      type: string;
      fields: {
        description: string;
        name: string;
        url: string;
      };
    };
  };
};
