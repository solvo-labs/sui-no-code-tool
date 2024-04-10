import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Input from "../Input";
import { ParticipantForm } from "../../utils/types";
import { Option, Select } from "../../components/Select";
import { CoinMetadata } from "@mysten/sui.js/client";
import TimeSelector from "../TimeSelector";
import { PERIOD } from "../../utils/enum";
import moment from "moment";

type Props = {
  open: boolean;
  disable: boolean;
  participant: ParticipantForm;
  participants: ParticipantForm[];
  coins: (CoinMetadata & { hex: string })[];
  handleParticipant: (participant: ParticipantForm) => void;
  handleParticipants: () => void;
  handleRemoveParticipant: (participant: ParticipantForm) => void;
  handleClose: () => void;
  createVestingItems: () => void;
};

const AddParticipantsModal: React.FC<Props> = ({
  open,
  disable,
  participant,
  participants,
  coins,
  handleParticipant,
  handleParticipants,
  handleRemoveParticipant,
  handleClose,
  createVestingItems,
}) => {
  const cancelButtonRef = useRef(null);

  const [durationList, setDurationList] = useState<Option[]>([]);

  useEffect(() => {
    const durationArray: string[] = Object.keys(PERIOD).filter((key) => isNaN(Number(key)));
    const duration: { key: string; value: number }[] = durationArray.map((period: any) => {
      return {
        key: period,
        value: Number(PERIOD[period]),
      };
    });

    setDurationList(duration);
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all h-2/5 sm:my-8">
                <div className="bg-white p-8">
                  <div className="max-h-[580px] gap-4 md:gap-8 md:flex md:items-start">
                    <div className="flex flex-col mt-3 text-center ml-4 sm:ml-0 xs:ml-0  sm:mt-0 md:text-left">
                      <Dialog.Title className="text-xl font-semibold text-gray-900">Add Participants</Dialog.Title>
                      <div className="mt-8 flex flex-col gap-4 md:gap-0">
                        <div className="flex flex-col gap-4">
                          <div className="w-full">
                            <Select
                              title="Tokens"
                              options={coins.map((co) => {
                                return { key: co?.name! + " (" + co?.symbol + ")", value: co?.hex! };
                              })}
                              onSelect={(value) => {
                                const selectedCoin = coins.find((coin: (CoinMetadata & { hex: string }) | null) => coin!.hex === value);
                                handleParticipant({ ...participant, selected_token: selectedCoin!.hex });
                              }}
                              selectedOption={participant.selected_token ? participant.selected_token : ""}
                              placeholder="Select token for Vesting"
                            />
                          </div>
                          <div className="flex w-full gap-4">
                            <div className="w-3/5">
                              <Input
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleParticipant({ ...participant, wallet_address: e.target.value })}
                                placeholder="Participants Wallet Address"
                                type="text"
                                value={participant.wallet_address}
                                title="Participants Wallet Adress"
                              ></Input>
                            </div>
                            <div className="w-2/5">
                              <Input
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleParticipant({ ...participant, balance: Number(e.target.value) })}
                                placeholder="Participants Balance"
                                type="text"
                                value={participant.balance}
                                title="Participants Balance"
                              ></Input>
                            </div>
                          </div>
                          <div className="flex w-full gap-4">
                            <div className="w-1/2">
                              <TimeSelector
                                title="Start Date"
                                direction="vertical"
                                handleDate={(e: ChangeEvent<HTMLInputElement>) => {
                                  const date = new Date(e.target.value);
                                  const timestamp = moment(date).valueOf();
                                  handleParticipant({ ...participant, start_date: timestamp });
                                }}
                                handleTime={(e: ChangeEvent<HTMLInputElement>) => {
                                  const vestingTime = moment(participant.start_date).format(`ddd MMM DD YYYY ${e.target.value}:00 [GMT]ZZ`);
                                  const timestamp = moment(vestingTime).valueOf();
                                  handleParticipant({ ...participant, start_date: timestamp });
                                }}
                                date={participant.start_date ? participant.start_date : undefined}
                              ></TimeSelector>
                            </div>
                            <div className="w-1/2">
                              <TimeSelector
                                title="End Date"
                                direction="vertical"
                                handleDate={(e: ChangeEvent<HTMLInputElement>) => {
                                  const date = new Date(e.target.value);
                                  const timestamp = moment(date).valueOf();
                                  handleParticipant({ ...participant, end_date: timestamp });
                                }}
                                handleTime={(e: ChangeEvent<HTMLInputElement>) => {
                                  const vestingTime = moment(participant.end_date).format(`ddd MMM DD YYYY ${e.target.value}:00 [GMT]ZZ`);
                                  const timestamp = moment(vestingTime).valueOf();
                                  handleParticipant({ ...participant, end_date: timestamp });
                                }}
                                date={participant.end_date ? participant.end_date : undefined}
                              ></TimeSelector>
                            </div>
                          </div>
                          <div className="w-full">
                            <TimeSelector
                              title="Cliff Date"
                              handleDate={(e: ChangeEvent<HTMLInputElement>) => {
                                const date = new Date(e.target.value);
                                const timestamp = moment(date).valueOf();
                                handleParticipant({ ...participant, cliff_time: timestamp });
                              }}
                              handleTime={(e: ChangeEvent<HTMLInputElement>) => {
                                const vestingTime = moment(participant.cliff_time).format(`ddd MMM DD YYYY ${e.target.value}:00 [GMT]ZZ`);
                                const timestamp = moment(vestingTime).valueOf();
                                handleParticipant({ ...participant, cliff_time: timestamp });
                              }}
                              date={participant.cliff_time ? participant.cliff_time : undefined}
                            ></TimeSelector>
                          </div>

                          <div className="flex">
                            <div className="w-2/5 pr-1">
                              <Input
                                onChange={(e) =>
                                  handleParticipant({
                                    ...participant,
                                    durationTime: {
                                      ...participant.durationTime,
                                      unit: Number(e.target.value),
                                    },
                                  })
                                }
                                placeholder="Unit"
                                type="text"
                                value={participant.durationTime.unit.toString()}
                                title="Unit"
                              ></Input>
                            </div>
                            <div className="w-3/5 pl-1">
                              <Select
                                title="Period"
                                options={durationList}
                                onSelect={(value) =>
                                  handleParticipant({
                                    ...participant,
                                    durationTime: {
                                      ...participant.durationTime,
                                      period: Number(value),
                                    },
                                  })
                                }
                                selectedOption={participant.durationTime.period}
                                placeholder="Select period"
                              ></Select>
                            </div>
                          </div>
                          <div className="flex">
                            <button
                              disabled={disable}
                              className="flex mt-2 p-0 group items-center text-sui-blue hover:text-sui-blue-h disabled:text-sui-blue-d disabled:cursor-not-allowed"
                              onClick={handleParticipants}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              <p className="pl-2 text-sm">Add Participants</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {participants.length > 0 && (
                      <div className="flex flex-col xl:min-w-96 lg:min-w-96 mt-0 md:mt-2 sm:mt-4 xs:mt-4">
                        <Dialog.Title as="h3" className="text-sm font-semibold leading-6 text-gray-900">
                          Participiants List
                        </Dialog.Title>
                        <div className="mt-4 flex flex-col max-h-[520px] overflow-y-auto">
                          {participants.map((prt: ParticipantForm, index: number) => (
                            <div className="flex flex-row mt-[2px]" key={index}>
                              <div className="flex flex-col w-full justify-between text-sm text-sui-blue-d rounded-lg border border-sui-blue-d p-4 my-1 mr-2">
                                <div className="flex flex-row justify-between">
                                  <h3 className="text-lg text-black font-bold mb-4">{prt.wallet_address}</h3>
                                  <div>
                                    <button className="pr-0 pt-0 group" onClick={() => handleRemoveParticipant(prt)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 stroke-gray-500 group-hover:stroke-red-500"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                      </svg>
                                    </button>
                                    <button className="pr-0 pt-0 group" onClick={() => {}}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5 stroke-gray-500 group-hover:stroke-green-500"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex flex-row gap-2 text-gray-400">
                                    Recipient Address:
                                    <p
                                      onClick={() => {
                                        window.open("https://suiexplorer.com/address/" + participant.wallet_address + "?network=testnet", "_blank");
                                      }}
                                      className="text-black hover:cursor-pointer hover:text-sui-blue-h"
                                    >
                                      {participant.wallet_address.slice(0, 10) + "..." + participant.wallet_address.slice(-10)}
                                    </p>
                                  </div>
                                  <div className="flex flex-row gap-2 text-gray-400">
                                    Recipient Amount: <p className="text-black">{participant.balance}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-sui-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sui-blue-h hover:ring-1 hover:ring-sui-blue-h sm:mt-0 sm:w-auto"
                    onClick={createVestingItems}
                    ref={cancelButtonRef}
                  >
                    Create Participants
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 hover:ring-1 hover:ring-red-600 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddParticipantsModal;
