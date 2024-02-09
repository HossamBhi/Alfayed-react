import { useTranslation } from "react-i18next";
import { FaPoundSign, FaUsers } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { RiFridgeFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StatisticCard } from "../cards";
import { useNavigate } from "react-router-dom";

const Statistics = () => {
  const total = useSelector((state: RootState) => state.accounts.total);
  const clients = useSelector((state: RootState) => state.clients);
  const products = useSelector((state: RootState) => state.stock.stock);
  const fridges = useSelector((state: RootState) => state.fridges.fridges);

  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 gap-2 p-2 md:gap-4 md:p-4 lg:grid-cols-4">
      <StatisticCard
        price={total}
        label={t("dashboard.total")}
        Icon={FaPoundSign}
        color="green"
        onClick={() => navigate("/accounts")}
      />
      <StatisticCard
        price={clients?.length}
        label={t("dashboard.clients")}
        Icon={FaUsers}
        color="blue"
        onClick={() => navigate("/clients")}
      />
      <StatisticCard
        price={products.length}
        label={t("dashboard.products")}
        Icon={FaBoxesStacked}
        color="purple"
        onClick={() => navigate("/stock")}
      />
      <StatisticCard
        price={fridges.length}
        label={t("dashboard.fridge")}
        Icon={RiFridgeFill}
        color="blue"
        onClick={() => navigate("/fridges")}
      />
    </div>
  );
};

export default Statistics;
