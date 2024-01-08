type Props = {
  text: string;
  checked: boolean;
  onChange: (event: any) => void;
};

const Checkbox: React.FC<Props> = ({ text, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        checked={checked}
        onChange={onChange}
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
      ></input>
      <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{text}</label>
    </div>
  );
};

export default Checkbox;
