import { useTranslation } from "react-i18next";
import { FaPoundSign, FaUsers } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { RiFridgeFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StatisticCard } from "../cards";

const Statistics = () => {
  const total = useSelector((state: RootState) => state.accounts.total);
  const clients = useSelector((state: RootState) => state.clients);
  const products = useSelector((state: RootState) => state.stock.products);
  const fridges = useSelector((state: RootState) => state.fridges.fridges);

  const { t } = useTranslation();

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
