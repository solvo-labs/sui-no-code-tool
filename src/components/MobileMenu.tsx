import { TiThMenu } from "react-icons/ti";

type Props = {
  handleToggle: () => void;
};

const MobileMenu: React.FC<Props> = ({ handleToggle }) => {
  return (
    <button onClick={handleToggle} className="rounded-sui-radius bg-white text-blue hover:text-blue-dark focus:outline-none">
      <TiThMenu className="w-6 h-6 font-bold" />
    </button>
  );
};

export default MobileMenu;
