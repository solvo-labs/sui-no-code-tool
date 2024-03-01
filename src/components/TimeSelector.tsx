import moment from "moment";
import React, { ChangeEvent } from "react";

type Props = {
  handleDate: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTime: (e: ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  date?: number;
};

const TimeSelector: React.FC<Props> = ({ title = "Select Date", date, handleDate, handleTime }) => {
  return (
    <div className="relative max-w-sm">
      <label className="block mb-2 text-sm font-medium text-gray-900">{title}</label>
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg> */}
      </div>
      <div className="flex">
        <input
          type="date"
          value={moment(date).format("YYYY-MM-DD")}
          onChange={handleDate}
          placeholder="Select date"
          className="w-1/2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-sui-blue hover:bg-gray-50 hover:border-gray-400 block w-full mr-1 ps-4 p-2.5"
        />
        <input
          type="time"
          value={moment(date).format("HH:mm")}
          onChange={handleTime}
          placeholder="Select time"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-sui-blue hover:bg-gray-50 hover:border-gray-400 block w-full ml-1 ps-4 p-2.5"
        ></input>
      </div>
    </div>
  );
};

export default TimeSelector;
