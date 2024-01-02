import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui.js/client";
import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const TokenDetail = () => {
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const { id } = useParams();
  const account = useCurrentAccount();

  useEffect(() => {
    const init = async () => {
      if (id && account) {
        // const coin = await suiClient.getCoins({
        //   coinType: id,
        //   owner: account.address,
        // });
        // console.log(coin);
        // const coinObject = await suiClient.getObject({
        //   id: coin.data[0].coinObjectId,
        //   options: {
        //     showContent: true,
        //   },
        // });
        // console.log(coinObject.data);
        const objectId = id.split("::")[0];
        suiClient
          .getObject({
            id: objectId,
            options: {
              showContent: true,
              showType: true,
            },
          })
          .then((dt) => {
            console.log(dt);
          });
      } else {
        // @to-do add toastr
        console.log("ERROR", "Something went wrong");
      }
    };

    init();
  }, [account, id, suiClient]);

  return <div>TokenDetail</div>;
};

export default TokenDetail;
