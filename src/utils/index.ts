import { CoinMetadata, CoinSupply, MoveStruct, MoveValue, ObjectOwner, SuiClient, SuiParsedData } from "@mysten/sui.js/client";

export const toolBox = () => {
  const handleFileClear = (setFile: any) => {
    setFile(null);
    // setNftFormData({ ...nftFormData, asset: "" });
  };

  const handleTooltip = (setState: any, second: number = 0) => {
    setState(true);

    setTimeout(() => {
      setState(false);
    }, second);
  };

  return { handleFileClear, handleTooltip };
};

export const uniqueArray = <T>(arr: T[]) => {
  return arr.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};

export const existPush = <T>(arr: T[], obj: T) => {
  if (arr.findIndex((ar) => ar === obj) > -1) {
    return;
  }

  arr.push(obj);
};

export const hexFormatter = (hex: string): string => {
  const first = hex.slice(0, 10);
  const end = hex.slice(-5);

  return first + "..." + end;
};

export const getCoin = async (suiClient: SuiClient, coinType: string) => {
  const metadata = await suiClient.getCoinMetadata({ coinType });
  const supply = await suiClient.getTotalSupply({ coinType });

  return { metadata, supply };
};

export const getCoins = async (suiClient: SuiClient, coinTypes: string[]) => {
  const coinTypePromises = coinTypes.map((ct: string) => suiClient.getCoinMetadata({ coinType: ct }));
  const coinSupplyPromises = coinTypes.map((ct: string) => suiClient.getTotalSupply({ coinType: ct }));
  const coinListP = await Promise.all(coinTypePromises);
  const coinList = coinListP.map((cl: CoinMetadata | null, index: number) => {
    return { ...cl, hex: coinTypes[index] };
  });
  const coinSupplies = await Promise.all(coinSupplyPromises);

  return { coinList, coinSupplies };
};

export function isAddressOwner(owner: ObjectOwner): owner is { AddressOwner: string } {
  return typeof owner === "object" && "AddressOwner" in owner;
}

export function isObjectOwner(owner: ObjectOwner): owner is { ObjectOwner: string } {
  return typeof owner === "object" && "ObjectOwner" in owner;
}

export function isSharedOwner(owner: ObjectOwner): owner is { Shared: { initial_shared_version: string } } {
  return typeof owner === "object" && "Shared" in owner;
}

export function isMoveObject(parsedData: SuiParsedData): parsedData is { dataType: "moveObject"; fields: MoveStruct; hasPublicTransfer: boolean; type: string } {
  return typeof parsedData === "object" && parsedData.dataType === "moveObject";
}

export function isMoveStructArray(obj: MoveStruct): obj is MoveValue[] {
  return Array.isArray(obj);
}

export function isMoveStructObject(obj: MoveStruct): obj is { fields: { [key: string]: MoveValue }; type: string } {
  return typeof obj === "object" && "fields" in obj && "type" in obj;
}

export function isCoinMetadata(obj: any): obj is { metadata: CoinMetadata; supply: CoinSupply } {
  return typeof obj === "object" && "metadata" in obj && "supply" in obj;
}
