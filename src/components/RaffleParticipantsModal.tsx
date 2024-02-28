import { FC, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { QueueListIcon } from "@heroicons/react/24/outline";
import { RaffleObject } from "../utils/types";

type Props = {
  open: boolean;
  setOpen: any;
  raffle: RaffleObject | undefined;
  handleClose: () => void;
};

const RaffleParticipantsModal: FC<Props> = ({ open, setOpen, raffle, handleClose }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <QueueListIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    {raffle && raffle.data.content.fields.participants.length <= 0 && (
                      <div className="flex flex-col mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          {raffle?.data.content.fields.name} Raffle's Participiant List
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">No one has participated in this raffle.</p>
                        </div>
                        <div className="mt-4 flex flex-col max-h-32 overflow-y-auto">
                          {raffle &&
                            raffle.data.content.fields.participants.map((participant: string) => (
                              <a className="text-sm hover:cursor-pointer hover:text-sui-blue py-4" key={participant}>
                                {participant}
                              </a>
                            ))}
                        </div>
                      </div>
                    )}
                    {raffle && raffle.data.content.fields.participants.length > 0 && (
                      <div className="flex flex-col mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          {raffle?.data.content.fields.name} Raffle's Participiant List
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">The participants are listed below.</p>
                        </div>
                        <div className="mt-4 flex flex-col max-h-32 overflow-y-auto">
                          {raffle &&
                            raffle.data.content.fields.participants.map((participant: string) => (
                              <a
                                onClick={() => {
                                  window.open("https://suiexplorer.com/address/" + participant + "?network=testnet", "_blank");
                                }}
                                className="text-sm hover:cursor-pointer hover:text-sui-blue py-4"
                                key={participant}
                              >
                                {participant}
                              </a>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 hover:ring-1 hover:ring-red-600 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                  {raffle && Number(raffle.data.content.fields.end_time) > Date.now() && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-lg bg-sui-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sui-blue-h hover:ring-1 hover:ring-sui-blue sm:mt-0 sm:w-auto"
                      onClick={handleClose}
                      ref={cancelButtonRef}
                    >
                      {raffle.data.content.fields.participants.length > 0 ? "I also want to participate in the raffle" : "I want to participate in the raffle"}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default RaffleParticipantsModal;
