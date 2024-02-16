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
import { AddEmployee } from "../components/popups";
import { useApi } from "../hooks";
import { ACCOUNTS, EMPLOYEES } from "../utils/endpoints";
import { createDataColumns, formatDate } from "../utils/helper";
import { employeeProps, supplierDataProps } from "../utils/types";
import { getTrasactionsEnums } from "../utils/enums";

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [showEdit, setShowEdit] = useState(false);
  const { post } = useApi();
  const [data, setData] = useState<null | employeeProps>(null);
  const [transactions, setTransactions] = useState<null | any[]>(
    null
  );

  useEffect(() => {
    if (id != null) {
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
  }, [id]);

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
    ];
  }, [columns]);

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="grid grid-cols-1">
        <CustomTable
          rows={transactions?.filter((item) => item.empID == id) || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default EmployeeDetails;
