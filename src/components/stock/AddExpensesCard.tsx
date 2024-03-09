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
import { useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks";
import { EXPENSES } from "../../utils/endpoints";
import { apiResponseStatus } from "../../utils/enums";
import {
  convertArrayToKeyObject,
  createDataColumns,
  formatDate,
  sortByCreatedDate,
} from "../../utils/helper";
import { expenseProps } from "../../utils/types";
import { CustomTable, PageTitle } from "../common";
import { AddExpenseToStock } from "../popups";

const AddExpensesCard = ({ farmId }: { farmId: null | number | string }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { get } = useApi();
  const [expensesData, setExpensesData] = useState<expenseProps[] | null>([]);
  const [editData, setEditData] = useState<null | expenseProps>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 0,
  });
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    if (id != null) {
      get({
        url: EXPENSES.getExpensesForFarmRecord,
        params: {
          id,
          pageSize: paginationModel.pageSize,
          pageNumber: paginationModel.page + 1,
        },
      }).then((res) => {
        console.log("EXPENSES.getRecordById: ", { res });
        if (res.responseID === apiResponseStatus.success) {
          setLastPage(res.lastPage);
          setExpensesData(convertArrayToKeyObject(res.responseValue, "id"));
        }
      });
    }
  }, [id, paginationModel]);
  const expensesDataArray = useMemo(
    () => sortByCreatedDate(Object.values(expensesData || {})),
    [expensesData]
  );
  const columns: GridColDef[] =
    !expensesDataArray || expensesDataArray?.length <= 0
      ? []
      : createDataColumns(expensesDataArray[0], (s: string) => t("table." + s));
  const customeColumns = useMemo(() => {
    if (columns.length <= 0) return columns;
    return [
      ...columns
        .filter(
          (col) =>
            ![
              "typeId",
              "id",
              "description",
              "expenseID",
              "farmRecordID",
              "expenseID",
            ].includes(col.field)
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
        title={t("AddToStock.expenses")}
      >
        <AddExpenseToStock
          showButtonTitle
          farmId={farmId}
          setExpensesData={setExpensesData}
          expensesData={expensesDataArray}
          onShowPress={() => {
            setEditData(null);
            setShowEdit(true);
          }}
          show={showEdit}
          onClose={() => setShowEdit(false)}
          editData={editData}
          setEditData={setEditData}
        />
      </PageTitle>
      <div className="grid grid-cols-1">
        <CustomTable
          rowCount={lastPage * paginationModel.pageSize}
          pageSizeOptions={[100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={expensesDataArray || []}
          columns={customeColumns as any}
          getRowId={(item) => item.expenseRecordID}
        />
      </div>
    </div>
  );
};

export default AddExpensesCard;
