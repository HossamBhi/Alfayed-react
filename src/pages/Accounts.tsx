import {
  GridColDef,
  GridRenderCellParams,
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
import { SafeAddBalanceOrWithdraw } from "../components/popups";
import { useApi } from "../hooks";
import { saveTotalAction, saveTransactionsAction } from "../redux/accounts";
import { RootState } from "../redux/store";
import { ACCOUNTS } from "../utils/endpoints";
import {
  apiResponseStatus,
  getTrasactionsEnums,
  trasactionsEnums,
} from "../utils/enums";
import {
  convertArrayToKeyObject,
  convertNTCS,
  createDataColumns,
  formatDate,
  formatDateTime,
  sortByCreatedDate,
} from "../utils/helper";
import usePathname from "../hooks/usePathname";

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
  const { t } = useTranslation();
  const { post, get } = useApi();
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.accounts.transactions
  );
  const total = useSelector((state: RootState) => state.accounts.total);
  const pathname = usePathname();
  const [showPay, setShowPay] = useState(false);
  const [payType, setPayType] = useState(trasactionsEnums.income);
  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear() + "-01-01")
  );
  const [endDate, setEndDate] = useState(new Date());

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 0,
  });
  const [lastPage, setLastPage] = useState(1);

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
    get({ url: ACCOUNTS.getTotal }).then((res) => {
      console.log("ACCOUNTS.getTotal: ", { res });
      if (res.responseID === apiResponseStatus.success) {
        dispatch(saveTotalAction(res.responseValue.total));
      }
    });
  }, [pathname]);
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
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
      },
    }).then((res) => {
      // console.log("ACCOUNTS.getAll: ", { res });
      if (
        res.responseID === apiResponseStatus.success &&
        Array.isArray(res?.responseValue)
      ) {
        setLastPage(res.lastPage);
        dispatch(
          saveTransactionsAction(
            convertArrayToKeyObject(res.responseValue, "id")
          )
        );
      }
    });
  }, [startDate, endDate, detailsType, paginationModel]);

  const transactionsArray = useMemo(
    () => sortByCreatedDate(Object.values(transactions || {})),
    [transactions]
  );

  const columns: GridColDef[] =
    !transactionsArray || transactionsArray?.length <= 0
      ? []
      : createDataColumns(transactionsArray[0], (s: string) => t("table." + s));

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
            : col.field === "type"
            ? {
                ...col,
                width: 150,
                renderCell: (props: GridRenderCellParams<any, Date>) => {
                  const { row } = props;
                  return (
                    <p
                      className={`py-1 px-4 w-full text-center rounded-md text-white bg-primary`}
                    >
                      {row.type === "Admin_Expense"
                        ? "ايداع من الادمن"
                        : row.type === "Income"
                        ? "ايداع"
                        : "سحب"}
                    </p>
                  );
                },
              }
            : { ...col, width: 120 }
        ),
    ];
  }, [columns]);

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-2">
      <SafeAddBalanceOrWithdraw
        hideShowBtn
        // setEditData={(data) => setEditData(data)}
        show={showPay}
        onClose={() => setShowPay(false)}
        onShowClick={() => setShowPay(true)}
        type={payType}
      />
      <div className="bg-background-card flex items-center justify-between rounded-lg px-2 py-2 md:px-4 md:py-4">
        <div className="flex justify-between items-center gap-2">
          <p className="text-md text-gray-600 md:text-xl">
            {t("dashboard.total")} :
          </p>
          <p className={`text-lg font-bold md:text-2xl text-green-600`}>
            {convertNTCS(total || "")}
          </p>
        </div>
        <div className="flex justify-between items-center gap-4">
          <CustomButton
            variant="contained"
            onClick={() => {
              setShowPay(true);
              setPayType(trasactionsEnums.income);
            }}
          >
            اضافه الي الخزنه
          </CustomButton>
          <CustomButton
            variant="outlined"
            onClick={() => {
              setShowPay(true);
              setPayType(trasactionsEnums.pay);
            }}
          >
            اضافه مصروفات
          </CustomButton>
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
          rowCount={lastPage * paginationModel.pageSize}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onColumnVisibilityModelChange={(val) => setVisibleColumns(val as any)}
          columnVisibilityModel={visibleColumns}
          rows={
            transactionsArray.filter((item) => {
              let result = item;
              switch (detailsType) {
                case getTrasactionsEnums.client:
                  result = item.clientID;
                  break;
                case getTrasactionsEnums.expense:
                  result = item.expenseID;
                  break;
                case getTrasactionsEnums.fridge:
                  result = item.fridgeID;
                  break;
                case getTrasactionsEnums.employee:
                  result = item.empID;
                  break;
                case getTrasactionsEnums.supplier:
                  result = item.farmID;
                  break;
                default:
                  result = item;
                  break;
              }
              return result
                ? new Date(item?.date) >= startDate &&
                    new Date(item?.date) <= endDate
                : false;
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
