import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GiFarmer } from "react-icons/gi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CardsContainer } from ".";
import { RootState } from "../../redux/store";
import { sortByCreatedDate } from "../../utils/helper";
import { UserCard } from "../cards";
import { AddFarm } from "../popups";

const FarmsAndFarmers = () => {
  const { t } = useTranslation();
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const navigate = useNavigate();
  const suppliersArray = useMemo(
    () => sortByCreatedDate(Object.values(suppliers || {}), "created_Date"),
    [suppliers]
  );
  return (
    <CardsContainer
      isLoading={suppliersArray === null}
      title={t("farmsAndFarmers")}
      titleButton={<AddFarm />}
      items={suppliersArray || []}
      moreLink="/suppliers"
      Card={({ item, ...params }: any) => (
        <UserCard
          item={item}
          onClick={(item) => navigate("farm-details?id=" + item.id)}
          Icon={GiFarmer}
          {...params}
        />
      )}
    />
  );
};

export default FarmsAndFarmers;
