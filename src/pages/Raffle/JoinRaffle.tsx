import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import useGetRaffle from "../../hooks/useGetRaffle";
import { useOutletContext } from "react-router-dom";
import { SuiClient } from "@mysten/sui.js/client";
import { Loader } from "../../components/Loader";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useEffect, useState } from "react";
import moment from "moment";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { PACKAGE_ID } from "../../utils";
import useGetRaffleTickets from "../../hooks/useGetRaffleTickets";
import { RaffleObject, RaffleTicketObject } from "../../utils/types";
import RaffleParticipantsModal from "../../components/RaffleParticipantsModal";

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

const JoinRaffle = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const [page, setPage] = useState(0);
  const [rafflesData, setRafflesData] = useState<any[]>([]);
  const { raffles, loadingRaffle } = useGetRaffle(account!, suiClient);
  const { tickets, loadingTickets } = useGetRaffleTickets(account!, suiClient);
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const [participantsOpen, setParticipantsOpen] = useState<boolean>(false);
  const [selectedRaffle, setSelecteddRaffle] = useState<RaffleObject>();

  useEffect(() => {
    const init = () => {
      if (!loadingRaffle && !loadingTickets) {
        const result = raffles.map((raffle: any) => {
          let winnerTicket = tickets.find(
            (ticket: RaffleTicketObject) => ticket.content.fields.raffle_id === raffle.data.objectId && ticket.content.fields.ticket_no === raffle.data.content.fields.winner
          );
          const isWinner = tickets.some((ticket: RaffleTicketObject) => {
            return ticket.content.fields.raffle_id === raffle.data.objectId && ticket.content.fields.ticket_no === raffle.data.content.fields.winner;
          });

          return isWinner
            ? {
                ...raffle,
                data: {
                  ...raffle.data,
                  won: true,
                  winnerTicketNo: winnerTicket?.objectId,
                },
              }
            : {
                ...raffle,
                data: {
                  ...raffle.data,
                  won: false,
                },
              };
        });

        const notAdmin = result.filter((raffle: RaffleObject) => raffle.data.content.fields.owner !== account?.address);
        setRafflesData(notAdmin);
      }
    };
    init();
  }, [tickets, raffles, loadingRaffle, loadingTickets]);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected);
  };

  const buy_ticket = (raffle: any) => {
    try {
      const tx = new TransactionBlock();
      const token = raffle.data.content.type.slice(88, -1);
      const ticket_price = raffle.data.content.fields.ticket_price;
      const raffleId = raffle.data.objectId;
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(ticket_price)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::coin_raffle::buy_ticket`,
        typeArguments: [token],
        arguments: [tx.object(raffleId), coin, tx.pure("0x6")],
      });

      tx.transferObjects([coin], tx.pure(account?.address));

      signAndExecute(
        {
          transactionBlock: tx as any,
          account: account!,
        },
        {
          onSuccess: (tx: any) => {
            suiClient
              .waitForTransactionBlock({
                digest: tx.digest,
              })
              .then((data: any) => {
                console.log(data);
                window.location.reload();
              });
          },
          onError: (error: any) => {
            console.log(error);
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const claim = async (raffle: RaffleObject) => {
    try {
      const tx = new TransactionBlock();
      const token = raffle.data.content.type.slice(88, -1);
      const raffleId = raffle.data.objectId;
      const raffleWinnerTicketNo = raffle.data.content.fields.winner;

      const winnerTicket = tickets?.filter(
        (ticket: RaffleTicketObject) => ticket.content.fields.raffle_id === raffleId && ticket.content.fields.ticket_no === raffleWinnerTicketNo
      );

      console.log(winnerTicket[0]);

      tx.moveCall({
        target: `${PACKAGE_ID}::coin_raffle::claim_prize`,
        typeArguments: [token],
        arguments: [tx.object(raffleId), tx.object(winnerTicket[0].objectId)],
      });

      signAndExecute(
        {
          transactionBlock: tx as any,
          account: account!,
        },
        {
          onSuccess: (tx: any) => {
            suiClient
              .waitForTransactionBlock({
                digest: tx.digest,
              })
              .then((data: any) => {
                console.log(data);
                window.location.reload();
              });
          },
          onError: (error: any) => {
            console.log(error);
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loadingRaffle || loadingTickets) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center text-3xl py-16">
        <div className="inline relative">
          <span className="text-navy-blue">Join Raffle</span>
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
                    <th className="px-6 py-3 text-md">ID</th>
                    <th className="px-6 py-3 text-md">Name</th>
                    <th className="px-6 py-3 text-md">End Time</th>
                    <th className="px-6 py-3 text-md">Reward</th>
                    <th className="px-6 py-3 text-md">Ticket Price</th>
                    <th className="px-6 py-3 text-md">Participants</th>
                    <th className="px-6 py-3 text-md">Action</th>
                  </tr>
                </thead>
                <tbody className="text-black text-left">
                  {rafflesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: RaffleObject) => (
                    <tr key={Math.random()} className="bg-white text-black hover:text-sui-blue hover:bg-gray-50">
                      <td
                        className="px-6 py-3 text-md cursor-pointer"
                        onClick={() => {
                          window.open("https://suiexplorer.com/object/" + item.data.objectId + "?network=testnet", "_blank");
                        }}
                      >
                        {item.data.content.fields.id.id.slice(0, 5) + "..." + item.data.content.fields.id.id.slice(-5)}
                      </td>
                      <td className="px-6 py-3 text-md">{item.data.content.fields.name}</td>
                      <td className="px-6 py-3 text-md">{moment.unix(Number(item.data.content.fields.end_time) / 1000).format("MM/DD/YYYY h:mm A")}</td>
                      <td className="px-6 py-3 text-md">{item.data.content.fields.reward}</td>
                      <td className="px-6 py-3 text-md">{(item.data.content.fields.ticket_price as unknown as number) / Math.pow(10, 9)}</td>
                      <td className="px-6 py-3 text-md ">
                        <div className="group flex justify-center gap-2 cursor-pointer items-center">
                          <p>{item.data.content.fields.ticket_count}</p>
                          <button
                            className="text-black p-0"
                            onClick={() => {
                              setSelecteddRaffle(item);
                              setParticipantsOpen(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-md cursor-pointer">
                        <div className="group">
                          <button className="text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                              />
                            </svg>
                          </button>
                          <div className="opacity-0 invisible cursor-default absolute rounded-lg w-max mt-2 bg-white border border-black shadow-xl px-2 py-2 -ml-20 z-50 group-focus-within:opacity-100 group-focus-within:visible transition-all">
                            <ul>
                              <li>
                                <button
                                  className={
                                    Number(item.data.content.fields.end_time) > Date.now()
                                      ? "hover:bg-sky-100 p-2 rounded-lg text-black cursor-pointer w-full justify-items-start flex"
                                      : "p-2 rounded-lg text-gray-400 cursor-default w-full justify-items-start flex"
                                  }
                                  onClick={() => buy_ticket(item)}
                                  disabled={Number(item.data.content.fields.end_time) < Date.now()}
                                >
                                  Buy Ticket
                                </button>
                              </li>
                              <li>
                                <button
                                  className={
                                    !item.data.content.fields.claimed && item.data.won
                                      ? "hover:bg-sky-100 p-2 rounded-lg text-black cursor-pointer w-full justify-items-start flex"
                                      : "p-2 rounded-lg text-gray-400 cursor-default w-full justify-items-start flex"
                                  }
                                  onClick={() => claim(item)}
                                  disabled={item.data.content.fields.claimed || !item.data.won}
                                >
                                  Claim
                                </button>
                              </li>
                              <li>
                                <button
                                  className={"hover:bg-sky-100 p-2 rounded-lg text-black cursor-pointer w-full justify-items-start flex"}
                                  onClick={() => console.log("Another Action")}
                                >
                                  Another Action
                                </button>
                              </li>
                            </ul>
                          </div>
                          <div className="invisible cursor-default fixed group-focus-within:visible inset-0 bg-black opacity-5"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <RaffleParticipantsModal
            open={participantsOpen}
            setOpen={setParticipantsOpen}
            handleClose={() => setParticipantsOpen(false)}
            raffle={selectedRaffle!}
            buy_ticket={() => buy_ticket(selectedRaffle)}
          ></RaffleParticipantsModal>
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
            pageCount={Math.ceil(raffles.filter((raffle: any) => raffle.data.content.fields.owner !== account?.address).length / rowsPerPage)}
            activeClassName="bg-navy-blue text-white"
            onPageChange={handlePageClick}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default JoinRaffle;
