import React from "react";

type Props = {
  title: string;
  disabled?: boolean;
  onClick: () => void;
};

const Button: React.FC<Props> = ({ title, disabled, onClick }) => {
  return (
    <button disabled={disabled} className="rounded-sui-radius bg-sui-blue text-white w-full" onClick={onClick}>
      <p className="text-[16px] font-bold">{title}</p>
    </button>
  );
};

export default Button;
