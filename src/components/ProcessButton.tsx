type Props = {
  title: string;
};

const ProcessButton: React.FC<Props> = ({ title }) => {
  return (
    <button type="button" className="button rounded-sui-radius flex gap-4 justify-center items-center bg-sui-blue place-content-around text-white w-1/2" disabled>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-[16px] font-bold">{title}</p>
    </button>
  );
};

export default ProcessButton;
