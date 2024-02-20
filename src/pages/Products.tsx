import { Tooltip, Typography } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomTable } from "../components/common";
import { AddPropduct } from "../components/popups";
import { useApi } from "../hooks";
import { saveProductsDetailsAction } from "../redux/stock";
import { RootState } from "../redux/store";
import { PRODUCTS } from "../utils/endpoints";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";

const Products = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const pathname = usePathname();
  // const [searchParams] = useSearchParams();
  const { get } = useApi();
  const productsDetails = useSelector(
    (state: RootState) => state.stock.productsDetails
  );
  const products = useSelector((state: RootState) => state.stock.products);
  useEffect(() => {
    get({ url: PRODUCTS.getAllDetails }).then((res) => {
      if (Array.isArray(res)) {
        dispatch(saveProductsDetailsAction(res));
      }
    });
  }, []);

  const columns: GridColDef[] =
    !productsDetails || productsDetails?.length <= 0
      ? []
      : createDataColumns(productsDetails[0], (s: string) => t("table." + s));

  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns
        .filter(
          (col) =>
            col.field !== "farmsID" &&
            col.field !== "typeId" &&
            col.field !== "productID"
          // &&
          // col.field !== "created_Date"
        )
        .map((col) =>
          col.field === "supplyDate"
            ? {
                ...col,
                width: 150,
                type: "date",
                align: "center",
                headerAlign: "center",
                valueFormatter: (params: GridValueFormatterParams) =>
                  formatDate(params.value),
                valueGetter: (params: GridValueGetterParams) =>
                  formatDate(params.value),
              }
            : col.field === "created_Date"
            ? {
                ...col,
                width: 200,
                type: "date",
                align: "center",
                headerAlign: "center",
                valueFormatter: (params: GridValueFormatterParams) =>
                  formatDateTime(params.value),
                valueGetter: (params: GridValueGetterParams) =>
                  formatDateTime(params.value),
              }
            : col.field === "farmsNotes"
            ? { ...col, width: 200 }
            : col.field === "isPercentage"
            ? {
                ...col,
                width: 120,
                headerName: t("AddToStock.discountType"),
                valueGetter: (params: GridValueGetterParams) => {
                  if (params.value === true) {
                    return t("AddToStock.discountPercentage");
                  }
                  return t("AddToStock.discountFlat");
                },
              }
            : col
        ),
      {
        field: "action",
        headerName: t("table.actions"),
        width: 150,
        type: "actions",
        getActions: (params: any) => {
          const { id } = params;

          return [
            <Tooltip key={id} title={t("common.edit")}>
              <GridActionsCellItem
                icon={<FaRegEdit size={16} />}
                label="Edit"
                sx={{ color: "primary.main" }}
                onClick={() => navigate("/add-to-stock?id=" + id)}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }, [columns]);

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-2">
      <div className="mb-4">
        <AddPropduct showButtonTitle />
      </div>

      <div className="grid grid-cols-1">
        <div className="bg-white px-2 pt-2 border mb-2 rounded-sm relative">
          <p className="pb-2 font-semibold text-md">
            {t("menu.products")} ({products.length})
          </p>
          <div className="pb-2 no-scrollbar relative h-full w-full overflow-x-scroll scroll-smooth whitespace-nowrap">
            {/* <div className="gap-2 flex flex-wrap mb-2 no-scrollbar relative w-full overflow-x-scroll scroll-smooth whitespace-nowrap"> */}
            {products.map((item, index) => (
              <Typography
                variant="subtitle2"
                className={`inline-block px-2 ${
                  index + 1 !== products.length && "border-e-2"
                }`}
                // onClick={() => navigate(pathname + "?id=" + item.id)}
                key={item.id}
                // variant={
                //   Number(searchParams.get("id")) === item.id
                //     ? "contained"
                //     : "outlined"
                // }
              >
                {item.name}
              </Typography>
            ))}
          </div>
        </div>
        <CustomTable
          rows={productsDetails || []}
          columns={customeColumns as any}
          getRowId={(item) => item.farmRecordID}
        />
      </div>
    </main>
  );
};

export default Products;
