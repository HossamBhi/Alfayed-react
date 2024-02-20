import { useSearchParams } from "react-router-dom";
import { ExpensesCard } from "../components/cards";
import { CustomTable, renderCellExpand } from "../components/common";
import { AddExpenses } from "../components/popups";
import { useApi } from "../hooks";
import { EXPENSES } from "../utils/endpoints";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";
import { supplierDataProps, supplierProps } from "../utils/types";
import {
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const ExpensesDetails = () => {
  const { t } = useTranslation();
  const [showEdit, setShowEdit] = useState(false);
  // const [id, setId] = useState<null | string>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
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
      get({ url: EXPENSES.getExpensesWithData, params: { id } }).then((res) => {
        console.log("EXPENSES.getExpensesWithData", { res });
        // if (Array.isArray(res)) {
        if (!res.status) {
          setSupplier({ ...res, totalRemaining: res.total });
          setSupplierData(res?.expensesList || []);
        } else {
          setSupplierData([]);
          alert("Error " + res.status + ": " + res.data);
        }
      });
    }
  }, [id]);

  const columns: GridColDef[] =
    !supplierData || supplierData?.length <= 0
      ? []
      : createDataColumns(supplierData[0], (s: string) => t("table." + s));

  const customeColumns = useMemo(() => {
    return columns
      .filter(
        (col) =>
          col.field !== "farmRecordID" &&
          col.field !== "productID" &&
          col.field != "typeId" &&
          // col.field !== "created_Date" &&
          col.field !== "expenseID"
      )
      .map((col) =>
        col.field === "expenseDate"
          ? {
              ...col,
              width: 150,
              type: "date",
              align: "center",
              headerAlign: "center",
              valueGetter: (params: GridValueGetterParams) =>
                formatDate(params.value),
              valueFormatter: (params: GridValueFormatterParams) =>
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
          : col.field === "expenseRecordNotes"
          ? { ...col, width: 200, renderCell: renderCellExpand }
          : col
      );
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
          <ExpensesCard
            item={supplier}
            containerStyle={"bg-white hover:bg-white mt-0"}
            showEdit
            onEdit={() => setShowEdit(true)}
            // onClick={() => setShowEdit(true)}
          />
        )}
        <AddExpenses
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
          getRowId={(item) => item.expenseRecordID}
        />
      </div>
    </main>
  );
};

export default ExpensesDetails;
