import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CardsContainer } from ".";
import { ExpensesCard } from "../cards";
import { AddExpenses } from "../popups";

const Expenses = () => {
  const { t } = useTranslation();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  return (
    <CardsContainer
      isLoading={expenses === null}
      title={t("dashboard.expenses")}
      titleButton={<AddExpenses />}
      items={expenses || []}
      Card={ExpensesCard}
      moreLink="/expenses"
    />
  );
};

export default Expenses;
