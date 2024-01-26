import { useTranslation } from "react-i18next";
import { PageTitle } from "../common";
import EditableTable, { productListProps } from "./EditableTable";

const CarProducts = ({
  productList,
  setProductList,
}: {
  productList: productListProps[];
  setProductList: (p: any) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle
        className={`col-span-1 mb-4 flex items-center justify-between`}
        title={t("client.categories")}
      ></PageTitle>
      <div className="grid grid-cols-1 bg-white">
        <EditableTable
          productList={productList}
          setProductList={setProductList}
        />
      </div>
    </div>
  );
};

export default CarProducts;
