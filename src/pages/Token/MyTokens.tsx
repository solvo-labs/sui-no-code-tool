import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { useCurrentAccount } from "@mysten/dapp-kit";
import useGetObjects from "../../hooks/useGetObjects";
import { Loader } from "../../components/Loader";
import { CoinMetadata, CoinSupply, SuiClient } from "@mysten/sui.js/client";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCoins, hexFormatter } from "../../utils";

const rowsPerPage = 5;
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

  const [page, setPage] = useState(0);
  const [coinData, setCoinData] = useState<((CoinMetadata & { hex: string }) | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [coinSupply, setCoinSupply] = useState<CoinSupply[]>([]);

  const { coins, objectLoading } = useGetObjects(wallet!);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { coinSupplies, coinList } = await getCoins(suiClient, coins || []);

      setCoinSupply(coinSupplies);

      setCoinData(coinList as any);

      setLoading(false);
    };

    init();
  }, [coins, suiClient]);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected);
  };

  if (objectLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center text-3xl py-16">
        <div className="inline relative">
          <span className="text-navy-blue">List Of My Tokens</span>
          <div className="border-t border-black absolute w-full left-1/2 transform -translate-x-1/2 mt-2"></div>
        </div>
      </div>
      <div className="relative w-full flex flex-col justify-center items-center mb-6">
        <div className="block bg-transparent w-full">
          <div className="flex justify-center items-center">
            <div className="w-1/2 xs:w-full overflow-x-auto">
              <table className="w-full">
                <thead className="text-white text-left bg-navy-blue">
                  <tr>
                    <th className="px-6 py-3 text-md">IMG</th>
                    <th className="px-6 py-3 text-md">ID</th>
                    <th className="px-6 py-3 text-md">Name</th>
                    <th className="px-6 py-3 text-md">Symbol</th>
                    <th className="px-6 py-3 text-md">Decimals</th>
                    <th className="px-6 py-3 text-md">Description</th>
                    <th className="px-6 py-3 text-md">Supply</th>
                  </tr>
                </thead>
                <tbody className="text-black text-left">
                  {coinData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: number) => (
                    <tr
                      key={Math.random()}
                      className="bg-white hover:bg-blue hover:text-sui-blue-h cursor-pointer"
                      onClick={() => {
                        navigate("/coin/" + item.hex);
                      }}
                    >
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
                      <td className="px-6 py-3 text-md">{Number(coinSupply[index].value) / Math.pow(10, item.decimals)}</td>
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
            pageRangeDisplayed={2}
            pageCount={Math.ceil(coinData.length / rowsPerPage)}
            activeClassName="bg-navy-blue text-white"
            onPageChange={handlePageClick}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default MyTokens;
