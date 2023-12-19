import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FaPoundSign, FaUsers } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { RiFridgeFill } from "react-icons/ri";

type StatisticCardProps = {
  price: number;
  Icon: IconType;
  label: string;
  color: string;
};

const Statistics = () => {
  const { t } = useTranslation();
  const StatisticCard = useCallback(
    ({ price, Icon, label, color }: StatisticCardProps) => {
      return (
        <div className="bg-background-card flex items-center justify-between rounded-lg px-2 py-2 md:px-4 md:py-4">
          <div className="flex w-full flex-col">
            <p
              className={`text-lg font-bold md:text-2xl text-${color}-600 pb-2`}
            >
              {price}
            </p>
            <p className="text-md text-gray-600 md:text-xl">{label}</p>
          </div>
          <div className={`bg-${color}-200 text-${color}-600 rounded-lg p-4`}>
            <Icon className={"text-[20px] md:text-[30px]"} />
          </div>
        </div>
      );
    },
    []
  );
  return (
    <div className="grid grid-cols-1 gap-2 p-2 md:gap-4 md:p-4 lg:grid-cols-4">
      <StatisticCard
        price={100000}
        label={t("dashboard.total")}
        Icon={FaPoundSign}
        color="green"
      />
      <StatisticCard
        price={100}
        label={t("dashboard.clients")}
        Icon={FaUsers}
        color="blue"
      />
      <StatisticCard
        price={10}
        label={t("dashboard.products")}
        Icon={FaBoxesStacked}
        color="purple"
      />
      <StatisticCard
        price={5}
        label={t("dashboard.fridge")}
        Icon={RiFridgeFill}
        color="blue"
      />
    </div>
  );
};

export default Statistics;
