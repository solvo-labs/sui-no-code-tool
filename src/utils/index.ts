import { CoinMetadata, CoinSupply, MoveStruct, MoveValue, ObjectOwner, SuiClient, SuiParsedData } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { BCS, getSuiMoveConfig } from "@mysten/bcs";

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

export function isStringId(obj: MoveValue): obj is { id: string } {
  return obj !== null && typeof obj === "object" && "id" in obj;
}

export function isStringArray(obj: MoveValue): obj is Array<string> {
  return obj !== null && Array.isArray(obj);
}

export function isCoinMetadata(obj: any): obj is { metadata: CoinMetadata; supply: CoinSupply } {
  return typeof obj === "object" && "metadata" in obj && "supply" in obj;
}

export function ownerChecker(obj: ObjectOwner): string {
  let ownerAddress: string = "";

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isAddressOwner(obj)
    ? (ownerAddress = obj.AddressOwner)
    : isObjectOwner(obj)
    ? (ownerAddress = obj.ObjectOwner)
    : isSharedOwner(obj)
    ? (ownerAddress = obj.Shared.initial_shared_version)
    : "Immutable";

  return ownerAddress;
}

export const getVrf = async (packageId: string, raffle: string, token: string, suiClient: SuiClient) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::coin_raffle::get_vrf_input`,
    typeArguments: [token],
    arguments: [tx.object(raffle)],
  });

  return suiClient
    .devInspectTransactionBlock({
      transactionBlock: tx,
      sender: "0x7777777777777777777777777777777777777777777777777777777777777777",
    })
    .then((resp) => {
      if (resp.results && resp.results[0].returnValues && resp.effects.status.status == "success") {
        // Deserialize the returned value into an array of LookupResult objects

        const returnValue = resp.results[0].returnValues[0]; // grab the 1st and only tuple

        const valueType = returnValue[1];
        const valueData = Uint8Array.from(returnValue[0]);

        const bcs = new BCS(getSuiMoveConfig());
        const lookupResults = bcs.de(valueType, valueData, "hex");

        return lookupResults;
      } else {
        throw new Error(resp.effects.status.error);
      }
    });
};

export const nftByteCode =
  "a11ceb0b060000000a01000e020e1c032a4e047806057e5b07d901f80108d103600ab1041a0ccb0485010dd0050600170116020c021202180219021b00030c00000103000102070003000700030504000504020006060700000f000100000a000100001b000200000e0304000018050400001a0604000007070400011c0d0e00020b1404010303090c0400030d1112010803100b0c0004141504010c0515090a0006110d0f000a1008130c10010608000106080201060806040a020a020a020708050003080005070805030708000a020708050208000708050208000501060805010501070805010804010a020108020108060108000106090001080301080101090002090005024944094e46544d696e74656406537472696e670a546573746e65744e4654095478436f6e74657874035549440355726c046275726e0763726561746f720664656c6574650b6465736372697074696f6e04656d6974056576656e740269640e6d696e745f746f5f73656e646572046e616d65036e6577156e65775f756e736166655f66726f6d5f6279746573066f626a656374096f626a6563745f69640f7075626c69635f7472616e736665720673656e64657206737472696e670b746573746e65745f6e6674087472616e736665720a74785f636f6e74657874127570646174655f6465736372697074696f6e0375726c04757466380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020002040d08040f08020a08021b080601020313080308050f08020001000004030b001000020101000004030b001001020201000004030b0010020203010000081a0a032e110d0c050b03110b0b0011070b0111070b02110e12000c040e0438000a050e04100014120138010b040b053802020401000004040b000b013802020501000004060b0111070b000f0115020601000004070b00130001010111090200010002000300";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const RAFFLES = "0xf3cdddc876721a47039baca054fb598cb0a0a57f0f28f28a59eb257569d7f896";
export const PACKAGE_ID = "0xb14a6edbd5fd238911d6cb868913563f06956941c04546b9fd3ad59ad7e4d571";
