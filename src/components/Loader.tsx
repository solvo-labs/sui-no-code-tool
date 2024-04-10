import Loading from "../assets/loading-spinner.gif";

export const Loader = () => {
  return (
    <div className="min-h-full relative flex flex-col justify-center items-center">
      <img className="w-14 h-14" src={Loading} alt="Loading Spinner" />
    </div>
  );
};
