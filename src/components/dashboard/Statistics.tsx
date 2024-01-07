import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FaPoundSign, FaUsers } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { RiFridgeFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type StatisticCardProps = {
  price: number | string | null;
  Icon: IconType;
  label: string;
  color: string;
};

const Statistics = () => {
  const total = useSelector((state: RootState) => state.accounts.total);
  // const suppliers = useSelector((state: RootState) => state.suppliers);
  const clients = useSelector((state: RootState) => state.clients);
  const products = useSelector((state: RootState) => state.stock.products);
  const fridges = useSelector((state: RootState) => state.fridges.fridges);

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
        price={total}
        label={t("dashboard.total")}
        Icon={FaPoundSign}
        color="green"
      />
      <StatisticCard
        price={clients?.length}
        label={t("dashboard.clients")}
        Icon={FaUsers}
        color="blue"
      />
      <StatisticCard
        price={products.length}
        label={t("dashboard.products")}
        Icon={FaBoxesStacked}
        color="purple"
      />
      <StatisticCard
        price={fridges.length}
        label={t("dashboard.fridge")}
        Icon={RiFridgeFill}
        color="blue"
      />
    </div>
  );
};

export default Statistics;
