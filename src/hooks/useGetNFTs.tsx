import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WalletAccount } from "@wallet-standard/core";
import { type } from "os";

export default function useGetNFTs(wallet: WalletAccount) {
  const [suiClient] = useOutletContext<[suiClient: any]>();
  const [nfts, setNFTs] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const result = await suiClient.getOwnedObjects({ owner: wallet.address });
      const resultNFTs = result.data;

      console.log(resultNFTs[0].data.objectId);

      const dynmic = await suiClient.getDynamicFieldObject({
        parentId: resultNFTs[0].data.objectId,
        name: { type: "string", value: "0x44d12155bb085df7d5432f0ad2419eb46195c449c327c716f43b733cfd17884d::devnet_nft::DevNetNFT" },
      });

      // const promises = resultNFTs.map((nft: any) => suiClient.getObject({ id: nft.data.objectId }));
      // console.log(promises);

      // const data = await Promise.all(promises);

      // console.log(data);

      // setNFTs(data);
    };

    init();
  }, [suiClient, wallet]);

  return { nfts };
}
