import {
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  CustomTable,
  DatePickerRange,
} from "../components/common";
import { useApi } from "../hooks";
import { saveTransactionsAction } from "../redux/accounts";
import { RootState } from "../redux/store";
import { ACCOUNTS } from "../utils/endpoints";
import { getTrasactionsEnums } from "../utils/enums";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";

const filter = [
  { id: getTrasactionsEnums.all, label: "الكل" },
  { id: getTrasactionsEnums.supplier, label: "الموردين" },
  { id: getTrasactionsEnums.expense, label: "المصروفات" },
  { id: getTrasactionsEnums.client, label: "العملاء" },
  { id: getTrasactionsEnums.fridge, label: "المحطات" },
  { id: getTrasactionsEnums.employee, label: "الموظفين" },
];
const currentDate = new Date();
const Accounts = () => {
  const transactions = useSelector(
    (state: RootState) => state.accounts.transactions
  );
  const total = useSelector((state: RootState) => state.accounts.total);
  const { t } = useTranslation();
  const { post } = useApi();
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear() + "-01-01")
  );
  const [endDate, setEndDate] = useState(new Date());

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  console.log({ transactions });
  const [detailsType, setDetailsType] = useState<getTrasactionsEnums>(
    getTrasactionsEnums.all
  );
  const [visibleColumns, setVisibleColumns] = useState({
    action: false,
    clientID: false,
    empID: false,
    expenseID: false,
    farmID: false,
    fridgeID: false,
    typeID: false,
    farmName: true,
    fridgeName: true,
    expenseName: true,
    empName: true,
    clientName: true,
  });

  useEffect(() => {
    switch (detailsType) {
      case getTrasactionsEnums.client:
        return setVisibleColumns({
          ...visibleColumns,
          farmName: false,
          fridgeName: false,
          expenseName: false,
          empName: false,
          clientName: true,
        });
      case getTrasactionsEnums.expense:
        return setVisibleColumns({
          ...visibleColumns,
          farmName: false,
          fridgeName: false,
          expenseName: true,
          empName: false,
          clientName: false,
        });
      case getTrasactionsEnums.fridge:
        return setVisibleColumns({
          ...visibleColumns,
          farmName: false,
          fridgeName: true,
          expenseName: false,
          empName: false,
          clientName: false,
        });
      case getTrasactionsEnums.employee:
        return setVisibleColumns({
          ...visibleColumns,
          farmName: false,
          fridgeName: false,
          expenseName: false,
          empName: true,
          clientName: false,
        });
      case getTrasactionsEnums.supplier:
        return setVisibleColumns({
          ...visibleColumns,
          farmName: true,
          fridgeName: false,
          expenseName: false,
          empName: false,
          clientName: false,
        });
      default:
        setVisibleColumns({
          ...visibleColumns,
          farmName: true,
          fridgeName: true,
          expenseName: true,
          empName: true,
          clientName: true,
        });
    }
  }, [detailsType]);

  useEffect(() => {
    post({
      url: ACCOUNTS.getAll,
      params: {
        recordType: detailsType,
        from: formatDate(startDate),
        to: formatDate(endDate),
        // ...paginationModel,
        // currentPage: paginationModel.page,
      },
    }).then((res) => {
      console.log("ACCOUNTS.getAll: ", { res });
      if (Array.isArray(res?.responseValue)) {
        dispatch(saveTransactionsAction(res.responseValue));
      }
    });
  }, [startDate, endDate, detailsType, paginationModel]);

  const columns: GridColDef[] =
    !transactions || transactions?.length <= 0
      ? []
      : createDataColumns(transactions[0], (s: string) => t("table." + s));

  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns
        .filter((col) => !["safeID"].includes(col.field))
        .map((col) =>
          col.field === "date"
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
            : ["notes"].includes(col.field)
            ? { ...col, width: 200 }
            : { ...col, width: 120 }
        ),
    ];
  }, [columns]);

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-2">
      <div className="bg-background-card flex items-center justify-between rounded-lg px-2 py-2 md:px-4 md:py-4">
        <div className="flex w-full justify-between items-center">
          <p className="text-md text-gray-600 md:text-xl">
            {t("dashboard.total")}
          </p>
          <p className={`text-lg font-bold md:text-2xl text-green-600 pb-2`}>
            {String(total)}
          </p>
        </div>
      </div>
      <div className="bg-background-card p-4 rounded-md border my-2">
        <h2 className="mb-2">تصنيف حسب</h2>
        <div className="gap-2 flex flex-wrap">
          {filter.map((item) => (
            <CustomButton
              onClick={() => setDetailsType(item.id)}
              key={item.id}
              variant={detailsType === item.id ? "contained" : "outlined"}
            >
              {item.label}
            </CustomButton>
          ))}
          <DatePickerRange
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
          rowCount={500}
          pageSizeOptions={[100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onColumnVisibilityModelChange={(val) => setVisibleColumns(val as any)}
          columnVisibilityModel={visibleColumns}
          rows={
            transactions.filter((item) => {
              switch (detailsType) {
                case getTrasactionsEnums.client:
                  return item.clientID;
                case getTrasactionsEnums.expense:
                  return item.expenseID;
                case getTrasactionsEnums.fridge:
                  return item.fridgeID;
                case getTrasactionsEnums.employee:
                  return item.empID;
                case getTrasactionsEnums.supplier:
                  return item.farmID;
                default:
                  return item;
              }
            }) || []
          }
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default Accounts;
