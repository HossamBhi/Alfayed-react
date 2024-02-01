import {
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  CustomButton,
  CustomTable,
  DatePickerRange,
} from "../components/common";
import { RootState } from "../redux/store";
import { getTrasactionsEnums } from "../utils/enums";
import { createDataColumns, formatDate } from "../utils/helper";

const filter = [
  { id: getTrasactionsEnums.all, label: "الكل" },
  { id: getTrasactionsEnums.supplier, label: "الموردين" },
  { id: getTrasactionsEnums.expense, label: "المصروفات" },
  { id: getTrasactionsEnums.client, label: "العملاء" },
  { id: getTrasactionsEnums.fridge, label: "المحطات" },
  { id: getTrasactionsEnums.employee, label: "الموظفين" },
];

const Accounts = () => {
  const { t } = useTranslation();
  const total = useSelector((state: RootState) => state.accounts.total);
  const transactions = useSelector(
    (state: RootState) => state.accounts.transactions
  );
  const [visibleColumns, setVisibleColumns] = useState({
    action: false,
    clientID: false,
    empID: false,
    expenseID: false,
    farmID: false,
    fridgeID: false,
    id: false,
    typeID: false,
    farmName: true,
    fridgeName: true,
    expenseName: true,
    empName: true,
    clientName: true,
  });
  const [detailsType, setDetailsType] = useState<getTrasactionsEnums>(
    getTrasactionsEnums.all
  );

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
  // console.log(transactions);
  // const { get } = useApi();
  // const [tableData, setTableData] = useState<null | supplierProps[]>(null);
  // useEffect(() => {
  //   get({ url: STORE.getAll }).then((res) => {
  //     console.log("STORE.getAll", { res });
  //     // if (Array.isArray(res)) {
  //     if (!res.status || Array.isArray(res)) {
  //       setTableData(res);
  //     } else {
  //       setTableData([]);
  //       alert("Error " + res.status + ": " + res.data);
  //     }
  //   });
  // }, []);

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
                width: 150,
                type: "date",
                align: "center",
                headerAlign: "center",
                valueFormatter: (params: GridValueFormatterParams) =>
                  formatDate(params.value),
                valueGetter: (params: GridValueGetterParams) =>
                  formatDate(params.value),
              }
            : ["notes"].includes(col.field)
            ? { ...col, width: 200 }
            : { ...col, width: 120 }
        ),
      // {
      //   field: "action",
      //   headerName: t("table.actions"),
      //   width: 150,
      //   type: "actions",
      //   getActions: (params: any) => {
      //     const { id } = params;

      //     return [
      //       <Tooltip key={id} title={t("common.show")}>
      //         <GridActionsCellItem
      //           icon={<FaEye size={16} />}
      //           label={t("common.show")}
      //           sx={{ color: "primary.main" }}
      //           onClick={() => navigate("/products")}
      //         />
      //       </Tooltip>,
      //     ];
      //   },
      // },
    ];
  }, [columns]);
  console.log({ visibleColumns });

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
          <DatePickerRange />
        </div>
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
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
