import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { useCurrentAccount } from "@mysten/dapp-kit";
import useGetObjects from "../../hooks/useGetObjects";
import { Loader } from "../../components/Loader";
import { CoinMetadata, CoinSupply, SuiClient } from "@mysten/sui.js/client";
import { useOutletContext } from "react-router-dom";
import { getCoins, hexFormatter } from "../../utils";

const itemsPerPage = 5;
const paginationVariants = {
  hidden: {
    opacity: 0,
    y: 200,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 1,
    },
  },
};

const MyTokens = () => {
  const wallet = useCurrentAccount();

  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();

  const [currentPage, setCurrentPage] = useState(0);
  const [coinData, setCoinData] = useState<(CoinMetadata | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [coinSupply, setCoinSupply] = useState<CoinSupply[]>([]);

  const { coins, objectLoading } = useGetObjects(wallet!);

  // in my wallets balance > 0
  // const { data, status } = useSuiClientQuery("getAllCoins", {
  //   owner: wallet?.address || "",
  //   limit: 0,
  // });

  useEffect(() => {
    const init = async () => {
      const offset = currentPage * itemsPerPage;

      const { coinSupplies, coinList } = await getCoins(suiClient, coins);

      setCoinSupply(coinSupplies);
      setCoinData(coinList.slice(offset, offset + itemsPerPage));

      setLoading(false);
    };

    init();
  }, [coins, currentPage, suiClient]);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  if (objectLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center text-3xl py-16">
        <div className="inline relative">
          <span className="text-navy-blue">List Of My Tokens</span>
          <div className="border-t border-black absolute w-full left-1/2 transform -translate-x-1/2 mt-2"></div>
        </div>
      </div>
      <div className="relative w-full flex flex-col justify-center items-center mb-6">
        <div className="block bg-transparent w-full">
          <div className="flex justify-center items-center">
            <div className="w-1/2 sm:w-3/4 xs:w-full overflow-x-auto">
              <table className="w-full">
                <thead className="text-white text-left bg-navy-blue">
                  <tr>
                    <th className="px-6 py-3 text-md"></th>
                    <th className="px-6 py-3 text-md">ID</th>
                    <th className="px-6 py-3 text-md">Name</th>
                    <th className="px-6 py-3 text-md">Symbol</th>
                    <th className="px-6 py-3 text-md">Decimals</th>
                    <th className="px-6 py-3 text-md">Description</th>
                    <th className="px-6 py-3 text-md">Supply</th>
                  </tr>
                </thead>
                <tbody className="text-black text-left">
                  {coinData.map((item: any, index: number) => (
                    <tr key={item.id} className="bg-white hover:bg-blue hover:text-white">
                      <td className="px-6 py-3 text-md">
                        {
                          <div className="flex items-center">
                            <div className="rounded-full overflow-hidden h-10 w-10">
                              <img className="w-full h-full object-cover" src={item.iconUrl} alt="Avatar" />
                            </div>
                          </div>
                        }
                      </td>
                      <td className="px-6 py-3 text-md">{hexFormatter(item.id)}</td>
                      <td className="px-6 py-3 text-md">{item.name}</td>
                      <td className="px-6 py-3 text-md">{item.symbol}</td>
                      <td className="px-6 py-3 text-md">{item.decimals}</td>
                      <td className="px-6 py-3 text-md">{item.description}</td>
                      <td className="px-6 py-3 text-md">{coinSupply[index].value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <motion.div variants={paginationVariants} initial="hidden" animate="visible">
          <ReactPaginate
            breakLabel={<span className="mr-4">...</span>}
            nextLabel={
              <span className="w-10 h-10 flex justify-center items-center bg-lightGray rounded-md">
                <BsChevronRight />
              </span>
            }
            previousLabel={
              <span className="w-10 h-10 flex justify-center items-center bg-lightGray rounded-md mr-4">
                <BsChevronLeft />
              </span>
            }
            containerClassName="flex justify-center items-center mt-8 mb-4"
            pageClassName="block border-solid w-10 h-10 flex justify-center items-center rounded-md mr-4"
            pageRangeDisplayed={3}
            pageCount={Math.ceil(coinData.length / itemsPerPage)}
            activeClassName="bg-navy-blue text-white"
            onPageChange={handlePageClick}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default MyTokens;
