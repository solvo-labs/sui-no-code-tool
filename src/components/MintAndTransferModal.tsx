import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TiWarningOutline } from "react-icons/ti";
import Input from "./Input";
import { TransferForm } from "../utils/types";
import Checkbox from "./Checkbox";

type Props = {
  open: boolean;
  disable: boolean;
  mintAndTransferCoin: () => void;
  form: TransferForm & { checkbox: boolean };
  address: string;
  handleForm: (form: TransferForm & { checkbox: boolean }) => void;
  handleClose: () => void;
};

const MintAndTransferModal: React.FC<Props> = ({ open, disable, mintAndTransferCoin, form, address, handleForm, handleClose }) => {
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                      <TiWarningOutline className="h-6 w-6 text-orange-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Mint And Transfer Coin
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          To transfer the coins, please enter the recipient's address below. If you enter the wrong recipient address, you may lose the coins permanently.
                        </p>
                        <Input
                          className="mt-8 mb-4"
                          onChange={(e: any) => handleForm({ ...form, balance: Number(e.target.value) })}
                          placeholder="Transfer amount"
                          type="text"
                          disable={false}
                          value={form.balance}
                        ></Input>
                        <Input
                          className="mt-8 mb-4"
                          onChange={(e: any) => handleForm({ ...form, recipient: e.target.value })}
                          placeholder="Recipient address"
                          type="text"
                          disable={form.checkbox}
                          value={form.recipient}
                        ></Input>
                        <Checkbox
                          checked={form.checkbox}
                          text="I want to send it to my own wallet"
                          onChange={(e: any) => {
                            !form.checkbox
                              ? handleForm({ ...form, checkbox: e.target.checked, recipient: address })
                              : handleForm({ ...form, checkbox: e.target.checked, recipient: "" });
                          }}
                        ></Checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    disabled={disable}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:bg-red-800"
                    onClick={mintAndTransferCoin}
                  >
                    Transfer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
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

export default MintAndTransferModal;
