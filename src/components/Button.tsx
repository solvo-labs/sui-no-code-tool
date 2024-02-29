import React from "react";

type Props = {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  leftImage?: any;
  rightImage?: any;
};

const Button: React.FC<Props> = ({ title, disabled, rightImage, leftImage, onClick }) => {
  return (
    <button
      disabled={disabled}
      className="flex flex-row justify-center rounded-sui-radius bg-sui-blue text-white w-full disabled:bg-sui-blue-d disabled:border disabled:border-sui-blue-d disabled:cursor-not-allowed hover:bg-sui-blue-h"
      onClick={onClick}
    >
      <div className="pr-2">{leftImage}</div>
      <p className="text-[16px] font-bold">{title}</p>
      <div className="pl-2">{rightImage}</div>
    </button>
  );
};

export default Button;
