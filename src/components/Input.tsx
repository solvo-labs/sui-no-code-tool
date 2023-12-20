import React from "react";

type Props = {
  title: string;
  placeholder: string;
  type: string;
  isRequired?: boolean;
  onChange: (event: any) => void;
};

const Input: React.FC<Props> = ({ title, type, placeholder, isRequired, onChange }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">{title}</label>
      <input
        onChange={onChange}
        type={type}
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required={isRequired}
      ></input>
    </div>
  );
};

export default Input;
