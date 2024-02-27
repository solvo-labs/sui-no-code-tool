import React from "react";

export type Option = {
  key: string;
  value: string | number;
};

type Props = {
  title: string;
  options: Option[];
  selectedOption: string | number | readonly string[] | undefined;
  placeholder?: string;
  onSelect: (value: string) => void;
};

export const Select: React.FC<Props> = ({ title, options, selectedOption, onSelect, placeholder = "Select an option" }) => {
  return (
    <div className="relative inline-flex w-full flex-col">
      <label className="mb-2 text-sm font-medium text-gray-900">{title}</label>
      <select
        className="border border-gray-300 rounded-lg cursor-pointer text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
        value={selectedOption}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelect(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: Option) => {
          return (
            <option key={opt.value} value={opt.value}>
              {opt.key}
            </option>
          );
        })}
      </select>
    </div>
  );
};
