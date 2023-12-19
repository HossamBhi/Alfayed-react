import { useTranslation } from "react-i18next";
import { FaUserTie } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CardsContainer } from ".";
import { RootState } from "../../redux/store";
import { UserCard } from "../cards";
import AddClient from "../popups/AddClient";

const Clients = () => {
  const { t } = useTranslation();
  const clients = useSelector((state: RootState) => state.clients);
  const navigate = useNavigate();

  return (
    <CardsContainer
      isLoading={clients === null}
      title={t("client.clients")}
      titleButton={<AddClient />}
      items={clients || []}
      moreLink="/clients"
      Card={({ item, ...params }: any) => (
        <UserCard
          item={item}
          onClick={(item) => navigate("client-details?id=" + item.id)}
          Icon={FaUserTie}
          {...params}
        />
      )}
    />
  );
};

export default Clients;
