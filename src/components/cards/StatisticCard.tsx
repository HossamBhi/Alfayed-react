import { IconType } from "react-icons";
import { convertNTCS } from "../../utils/helper";

export type StatisticCardProps = {
  price: number | string | null;
  Icon: IconType;
  label: string;
  color: string;
  onClick: () => void;
};

const StatisticCard = ({
  price,
  Icon,
  label,
  color,
  onClick,
}: StatisticCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-background-card cursor-pointer flex items-center justify-between rounded-lg px-2 py-2 md:px-4 md:py-4"
    >
      <div className="flex w-full flex-col">
        <p className={`text-lg font-bold md:text-2xl text-${color}-600 pb-2`}>
          {convertNTCS(price || "")}
        </p>
        <p className="text-md text-gray-600 md:text-xl">{label}</p>
      </div>
      <div className={`bg-${color}-200 text-${color}-600 rounded-lg p-4`}>
        <Icon className={"text-[20px] md:text-[30px]"} />
      </div>
    </div>
  );
};

export default StatisticCard;
