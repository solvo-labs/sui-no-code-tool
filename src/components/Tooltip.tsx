import React from "react";

type Props = {
  title: string;
  isOpen: boolean;
  position: "top" | "bottom";
};
const Tooltip: React.FC<Props> = ({ title, isOpen, position }) => {
  return (
    <>
      {isOpen && position === "bottom" && (
        <div className="flex absolute text-white bottom-[380px] left-[470px] w-72">
          <svg className="absolute left-4 text-black h-4 bottom-0" viewBox="0 0 255 255">
            <polygon className="fill-current" points="0,255 127.5,127.5 255,255" />
          </svg>
          <div className="absolute flex bg-gray-900 top-0 left-0 min-w-48 max-w-72 shadow-xl px-4 py-2 rounded-xl">
            <p className="flex w-full">{title}</p>
          </div>
        </div>
      )}
      {isOpen && position === "top" && (
        <div className="flex absolute text-white top-[520px] left-[470px] w-72">
          <svg className="absolute left-4 text-black h-4 top-0" viewBox="0 0 255 255">
            <polygon className="fill-current" points="255,0 127.5,127.5 0,0" />
          </svg>
          <div className="absolute flex bg-gray-900 bottom-0 left-0 max-w-72 shadow-xl px-4 py-2 rounded-xl">
            <p className="flex w-full">{title}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
