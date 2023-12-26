import { SuiClient } from "@mysten/sui.js/client";

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

export const hexFormatter = (hex: string) => {
  const first = hex.slice(0, 15);
  const end = hex.slice(-3);

  return first + "..." + end;
};

export const getCoins = async (suiClient: SuiClient, coins: any) => {
  const regex = /<([^>]*)>/;
  const coinTypes = coins.map((c: any) => {
    return c.data?.content.type.match(regex)[1];
  });

  const coinTypePromises = coinTypes.map((ct: string) => suiClient.getCoinMetadata({ coinType: ct }));
  const coinSupplyPromises = coinTypes.map((ct: string) => suiClient.getTotalSupply({ coinType: ct }));
  const coinList = await Promise.all(coinTypePromises);
  const coinSupplies = await Promise.all(coinSupplyPromises);

  return { coinList, coinSupplies };
};
