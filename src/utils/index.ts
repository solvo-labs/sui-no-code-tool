import { CoinMetadata, MoveStruct, MoveValue, ObjectOwner, SuiClient, SuiParsedData } from "@mysten/sui.js/client";

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

export const nftByteCode =
  "a11ceb0b060000000a01000e020e1c032a4e047806057e5b07d901f70108d003600ab0041a0cca0485010dcf050600170116020c021202180219021b00000c00000203000103070003010700030504000504020006060700000f000100000a000100001b000200000e0304000018050400001a0604000007070400011c0d0e00020b1404010303090c0400030d1112010803100b0c0004141504010c0515090a0006110d0f000a1008130c10010608000106080201060806040a020a020a020708050003080005070805030708000a020708050208000708050208000501060805010501070805010804010a020108020108060108000106090001080301080101090002090005094465764e65744e4654024944094e46544d696e74656406537472696e67095478436f6e74657874035549440355726c046275726e0763726561746f720664656c6574650b6465736372697074696f6e04656d6974056576656e740269640e6d696e745f746f5f73656e646572046e616d65036e6577156e65775f756e736166655f66726f6d5f6279746573066f626a656374096f626a6563745f69640f7075626c69635f7472616e736665720673656e64657206737472696e670b746573746e65745f6e6674087472616e736665720a74785f636f6e74657874127570646174655f6465736372697074696f6e0375726c04757466380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020002040d08040f08020a08021b080601020313080308050f08020001000004030b001000020101000004030b001001020201000004030b0010020203010000081a0a032e110d0c050b03110b0b0011070b0111070b02110e12000c040e0438000a050e04100014120138010b040b053802020401000004040b000b013802020501000004060b0111070b000f0115020601000004070b00130001010111090200010002000300";
