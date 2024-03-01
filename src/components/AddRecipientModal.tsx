import { ChangeEvent, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { QueueListIcon } from "@heroicons/react/24/outline";
import Input from "./Input";
import { RecipientForm } from "../utils/types";

type Props = {
  open: boolean;
  disable: boolean;
  recipient: RecipientForm;
  recipientList: RecipientForm[];
  handleRecipient: (recipient: RecipientForm) => void;
  handleRecipients: () => void;
  handleRemoveRecipient: (recipent: RecipientForm) => void;
  handleClose: () => void;
};

const AddRecipientModal: React.FC<Props> = ({ open, disable, recipient, recipientList, handleRecipient, handleRecipients, handleRemoveRecipient, handleClose }) => {
  const cancelButtonRef = useRef(null);

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <QueueListIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Manage Recipient
                      </Dialog.Title>
                      <div className="flex w-full mt-8 items-end">
                        <div className="w-7/12 pr-2">
                          <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRecipient({ ...recipient, walletAddress: e.target.value })}
                            placeholder="Recipient Wallet Address"
                            type="text"
                            value={recipient.walletAddress}
                            title="Recipient Wallet Adress"
                          ></Input>
                        </div>
                        <div className="w-3/12 pl-2">
                          <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRecipient({ ...recipient, amount: e.target.value })}
                            placeholder="Recipient Amount"
                            type="text"
                            value={recipient.amount}
                            title="Recipient Amount"
                          ></Input>
                        </div>
                        <div className="w-2/12 pl-4">
                          <button
                            disabled={disable}
                            className="flex group items-center justify-center w-10 h-10 p-0 rounded-full bg-inherit border border-gray-300 hover:bg-blue-100 hover:border-0 disabled:border disabled:border-gray-200 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onClick={handleRecipients}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 group-hover:stroke-sui-blue-h group-disabled:stroke-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {recipientList.length > 0 && (
                        <div className="mt-8">
                          <Dialog.Title as="h3" className="text-sm font-semibold leading-6 text-gray-900">
                            Participiants List
                          </Dialog.Title>
                          <div className="my-4 flex flex-col  max-h-36 overflow-y-auto">
                            {recipientList.map((recipent: RecipientForm, index: number) => (
                              <div className="flex flex-row mt-[2px]" key={index}>
                                <div
                                  className="flex flex-row w-11/12 justify-between text-sm text-sui-blue-d rounded-lg border border-sui-blue-d hover:cursor-pointer hover:text-sui-blue-h hover:border-sui-blue-h p-2 my-1 mr-2"
                                  onClick={() => {
                                    window.open("https://suiexplorer.com/address/" + recipent.walletAddress + "?network=testnet", "_blank");
                                  }}
                                >
                                  <p>{recipent.walletAddress.slice(0, 10) + "..." + recipent.walletAddress.slice(-5)}</p>
                                  <p>{recipent.amount}</p>
                                </div>
                                <button className="pl-2 group" onClick={() => handleRemoveRecipient(recipent)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 group-hover:stroke-red-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddRecipientModal;
