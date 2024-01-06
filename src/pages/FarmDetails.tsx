import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCard } from "../components/cards";
import { CustomTable } from "../components/common";
import { AddFarm } from "../components/popups";
import PayEmployee from "../components/popups/PayEmployee";
import { useApi } from "../hooks";
import { SUPPLIERS } from "../utils/endpoints";
import { createDataColumns, formatDate } from "../utils/helper";
import { supplierDataProps, supplierProps } from "../utils/types";

const FarmDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [showEdit, setShowEdit] = useState(false);
  // const [id, setId] = useState<null | string>(null);
  const { get } = useApi();
  const [supplier, setSupplier] = useState<null | supplierProps>(null);
  const [supplierData, setSupplierData] = useState<null | supplierDataProps[]>(
    null
  );

  useEffect(() => {
    // const searchQuiry = new URLSearchParams(window.location.search);
    // const ID = searchQuiry.get("id");
    if (id != null) {
      // setId(ID);
      get({ url: SUPPLIERS.getRecordWithData, params: { recordId: id } }).then(
        (res) => {
          console.log("farm data get Record With Data", { res });
          // if (Array.isArray(res)) {
          if (!res.status) {
            setSupplier(res);
            setSupplierData(res.farmRecords);
          } else {
            setSupplierData([]);
            alert("Error " + res.status + ": " + res.data);
          }
        }
      );
    }
  }, [id]);

  const columns: GridColDef[] =
    !supplierData || supplierData?.length <= 0
      ? []
      : createDataColumns(supplierData[0], (s: string) =>
          t("supplierTable." + s)
        );

  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns
        .filter(
          (col) =>
            col.field !== "farmsID" &&
            col.field !== "productID" &&
            col.field != "typeId"
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
                width: 150,
                type: "date",
                align: "center",
                headerAlign: "center",
                valueFormatter: (params: GridValueFormatterParams) =>
                  formatDate(params.value),
                valueGetter: (params: GridValueGetterParams) =>
                  formatDate(params.value),
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

  if (id === null || !supplier || !supplierData) {
    return (
      <main className="flex min-h-screen flex-col">
        {/* <LinearProgress
          sx={{ minWidth: "100%" }}
          className="absolute top-0 rounded"
        /> */}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="m-0">
        {id != null && (
          <UserCard
            item={supplier}
            containerStyle={"bg-white hover:bg-white mt-0"}
            showEdit
            Icon={GiFarmer}
            onEdit={() => setShowEdit(true)}
            onClick={() => setShowEdit(true)}
          />
        )}
        {/* <PayEmployee
          showButtonTitle
          // hideShowBtn
          // editData={editData}
          // setEditData={(data) => setEditData(data)}
          // show={showPay}
          // onClose={() => setShowPay(false)}
          // onShowClick={() => setShowPay(true)}
        /> */}
        <AddFarm
          hideShowBtn={true}
          editData={supplier}
          setEditData={(data) => setSupplier(data)}
          show={showEdit}
          onClose={() => setShowEdit(false)}
        />
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
          rows={supplierData || []}
          columns={customeColumns as any}
          getRowId={(item) => item.farmRecordID}
        />
      </div>
    </main>
  );
};

export default FarmDetails;
