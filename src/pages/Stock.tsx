import { Tooltip } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BsFillPlusCircleFill,
  BsFillPlusSquareFill,
  BsPlusCircleFill,
} from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CustomButton, CustomTable } from "../components/common";
import { useApi } from "../hooks";
import { editStockAction, saveStockAction } from "../redux/stock";
import { RootState } from "../redux/store";
import { STORE } from "../utils/endpoints";
import { apiResponseStatus } from "../utils/enums";
import { createDataColumns } from "../utils/helper";

const Stock = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { get, post } = useApi();
  const dispatch = useDispatch();
  const stock = useSelector((state: RootState) => state.stock.stock);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 0,
  });
  const [lastPage, setLastPage] = useState(1);
  useEffect(() => {
    get({
      url: STORE.getAll,
      params: {
        pageNumber: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      },
    }).then((res) => {
      console.log("STORE.getAll", { res });

      if (res.responseID === apiResponseStatus.success) {
        setLastPage(res.lastPage);
        dispatch(saveStockAction(res.responseValue));
      }
    });
  }, []);

  const columns: GridColDef[] =
    !stock || stock?.length <= 0
      ? []
      : createDataColumns(stock[0], (s: string) => t("table." + s));

  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns
        .filter((col) => col.field !== "notes")
        .map((col) =>
          col.field === "productName"
            ? { ...col, width: 200 }
            : col.field === "quantity"
            ? { ...col, width: 200 }
            : col
        ),
      {
        field: "action",
        headerName: t("table.actions"),
        width: 150,
        type: "actions",
        getActions: (params: any) => {
          const { id, row } = params;
          return [
            <Tooltip key={id} title={t("common.show")}>
              <GridActionsCellItem
                icon={<FaEye size={16} />}
                label={t("common.show")}
                sx={{ color: "primary.main" }}
                onClick={() =>
                  navigate(
                    `/products?productName=${row.productName}&productID=${row.productID}`
                  )
                }
              />
            </Tooltip>,
            <Tooltip key={"add-to-fridge"} title={t("fridges.addToTitle")}>
              <GridActionsCellItem
                icon={<BsFillPlusSquareFill size={16} />}
                label={t("fridges.addToTitle")}
                sx={{ color: "primary.main" }}
                onClick={() => navigate(`/add-to-fridge`)}
              />
            </Tooltip>,
            <Tooltip key={"add-to-stock"} title={t("menu.addToStock")}>
              <GridActionsCellItem
                icon={<BsPlusCircleFill size={16} />}
                label={t("menu.addToStock")}
                sx={{ color: "primary.main" }}
                onClick={() => navigate(`/add-to-stock`)}
              />
            </Tooltip>,
            <Tooltip key={"zero-stock"} title={t("stock.deleteQuantity")}>
              <GridActionsCellItem
                icon={<MdClose size={18} />}
                label={t("stock.deleteQuantity")}
                sx={{ color: "error.main" }}
                onClick={() => {
                  // alert("Delete quantity");
                  post({ url: STORE.setProductQtyToZero, params: { id } }).then(
                    (res) => {
                      console.log({ res });
                      if (res.responseID === apiResponseStatus.success) {
                        toast.success(" تم الحفظ بنجاح ");
                        dispatch(editStockAction(res.responseValue));
                      }
                    }
                  );
                }}
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
        <CustomButton
          variant="contained"
          onClick={() => navigate("/add-to-stock")}
        >
          <BsFillPlusCircleFill className="me-4" /> {t("menu.addToStock")}
        </CustomButton>
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
          rowCount={paginationModel.pageSize * lastPage}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          columnVisibilityModel={{
            productID: true,
          }}
          rows={stock || []}
          columns={customeColumns as any}
          getRowId={(item) => item.productID}
        />
      </div>
    </main>
  );
};

export default Stock;
