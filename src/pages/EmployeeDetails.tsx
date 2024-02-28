import {
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { CustomTable } from "../components/common";
import { AddEmployee, PayForm } from "../components/popups";
import { useApi } from "../hooks";
import { ACCOUNTS } from "../utils/endpoints";
import { getTrasactionsEnums, profileEnums } from "../utils/enums";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";
import { employeeProps } from "../utils/types";

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const employeeData = {
    id: Number(searchParams.get("id")),
    name: searchParams.get("name") || "",
    salary: searchParams.get("salary") || "",
    total: searchParams.get("total") || 0,
  };
  const { post } = useApi();
  const [transactions, setTransactions] = useState<null | any[]>(null);
  const [editData, setEditData] = useState<null | employeeProps>(null);
  const [showPay, setShowPay] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // const handleRowEdit = () => {
  //   setEditData(employeeData);
  //   setShowEdit(true);
  // };

  useEffect(() => {
    if (employeeData.id != null) {
      post({
        url: ACCOUNTS.getAll,
        params: {
          recordType: getTrasactionsEnums.employee,
          from: formatDate(new Date("2024-01-01")),
          to: formatDate(new Date()),
        },
      }).then((res) => {
        // console.log("ACCOUNTS.getAll: ", { res });
        if (Array.isArray(res?.responseValue)) {
          setTransactions(res.responseValue);
        }
      });
    }
  }, [employeeData.id]);

  const columns: GridColDef[] =
    !transactions || transactions?.length <= 0
      ? []
      : createDataColumns(transactions[0], (s: string) => t("table." + s));
  console.log({ transactions });
  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns
        .filter(
          (col) =>
            ![
              "safeID",
              "action",
              "clientID",
              "expenseID",
              "farmID",
              "fridgeID",
              "typeID",
              "farmName",
              "fridgeName",
              "expenseName",
              "clientName",
              "empID",
            ].includes(col.field)
        )
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
    <main className="flex min-h-screen flex-col p-4">
      <AddEmployee
        hideShowBtn
        editData={editData}
        setEditData={(data) => setEditData(data)}
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onShowClick={() => setShowEdit(true)}
      />
      <PayForm
        hideShowBtn
        editData={editData}
        setEditData={(data) => setEditData(data)}
        show={showPay}
        onClose={() => setShowPay(false)}
        onShowClick={() => setShowPay(true)}
        type={profileEnums.employees}
      />
      <div className="my-2 bg-white border rounded-md p-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex-1 flex gap-2 divide-x-2 divide-x-reverse w-full">
          <div className="px-2 text-gray-600">
            <strong className="text-black">{t("AddEmployee.name")}</strong> :{" "}
            {searchParams.get("name")}
          </div>
          <div className="px-2 text-gray-600">
            <strong className="text-black">{t("AddEmployee.salary")}</strong> :{" "}
            {searchParams.get("salary")}
          </div>
          <div className="px-2 text-gray-600">
            <strong className="text-black">{t("AddEmployee.total")}</strong> :{" "}
            {searchParams.get("total")}
          </div>
        </div>
        {/* <div className="gap-2 flex">
          <CustomButton
            variant="contained"
            startIcon={<FaRegEdit size={16} />}
            onClick={() => handleRowEdit()}
          >
            {t("common.edit")}
          </CustomButton>
          <CustomButton
            variant="contained"
            startIcon={<MdOutlineAttachMoney size={16} />}
            onClick={() => {
              setEditData(employeeData);
              setShowPay(true);
            }}
          >
            {t("PayEmployee.pay")}
          </CustomButton>
        </div> */}
      </div>
      <div className="grid grid-cols-1">
        <CustomTable
          rows={
            transactions?.filter((item) => item.empID == employeeData.id) || []
          }
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default EmployeeDetails;
