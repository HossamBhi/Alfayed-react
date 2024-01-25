import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks";
import { createDataColumns, formatDate } from "../../utils/helper";
import { expenseProps } from "../../utils/types";
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
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { get } = useApi();
  const [expensesData, setExpensesData] = useState<expenseProps[] | null>([]);
  const [editData, setEditData] = useState<null | expenseProps>(null);
  const [showEdit, setShowEdit] = useState(false);

  // useEffect(() => {
  //   if (id != null) {
  //     get({ url: EXPENSES.getExpensesForFarmRecord, params: { id } }).then(
  //       (res) => {
  //         console.log("EXPENSES.getRecordById: ", { res });
  //         if (res.status) {
  //           setExpensesData([]);
  //         } else {
  //           setExpensesData(res);
  //         }
  //       }
  //     );
  //   }
  // }, [id]);

  const columns: GridColDef[] =
    !productList || productList?.length <= 0
      ? []
      : createDataColumns(productList[0], (s: string) => t("table." + s));
  const customeColumns = useMemo(() => {
    if (columns.length <= 0) return columns;
    return [
      ...columns
        .filter(
          (col) =>
            col.field !== "expenseID" &&
            col.field !== "farmRecordID" &&
            // col.field !== "created_Date" &&
            col.field !== "expenseID"
          // col.field !== "expenseRecordID"
        )
        .map((col) =>
          col.field === "expenseDate"
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
            : col.field === "expenseRecordNotes"
            ? { ...col, width: 150 }
            : col.field === "expenseName"
            ? { ...col, width: 150 }
            : col.field === "additionalNotes"
            ? { ...col, width: 150 }
            : col
        ),
      {
        field: "actions",
        headerName: t("table.actions"),
        width: 150,
        type: "actions",
        getActions: (params: GridValueGetterParams) => {
          const { row, id } = params;
          return [
            <Tooltip key={id} title={t("common.edit")}>
              <GridActionsCellItem
                icon={<FaRegEdit size={16} />}
                label="Edit"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  setShowEdit(true);
                  setEditData(row);
                }}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }, [columns]);
  return (
    <div>
      <PageTitle
        className={`col-span-1 mb-4 flex items-center justify-between`}
        title={t("client.categories")}
      >
        {/* <AddExpenseToStock
          showButtonTitle
          // farmId={farmId}
          setExpensesData={setExpensesData}
          expensesData={expensesData}
          onShowPress={() => setShowEdit(true)}
          show={showEdit}
          onClose={() => setShowEdit(false)}
          editData={editData}
          setEditData={setEditData}
        /> */}
      </PageTitle>
      <div className="grid grid-cols-1 bg-white">
        {/* <CustomTable
          rows={productList || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        /> */}
        <EditableTable
          productList={productList}
          setProductList={setProductList}
        />
      </div>
    </div>
  );
};

export default CarProducts;
