import React from "react";

type Props = {
  value: string | number;
  title?: string;
  placeholder: string;
  type: string;
  isRequired?: boolean;
  disable?: boolean;
  className?: string;
  onChange: (event: any) => void;
};

const Input: React.FC<Props> = ({ value, title, type, placeholder, isRequired, disable, className = "relative inline-flex w-full flex-col", onChange }) => {
  return (
    <div className={className}>
      <label className="mb-2 text-sm font-medium text-gray-900">{title}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-sui-blue hover:bg-gray-50 hover:border-gray-400 h-10 block w-full p-2.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-100"
        placeholder={placeholder}
        required={isRequired}
        disabled={disable}
      ></input>
    </div>
  );
};

export default Input;
