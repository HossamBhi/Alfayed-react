import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { CustomTable } from "../components/common";
import { AddEmployee, PayForm } from "../components/popups";
import { RootState } from "../redux/store";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";
import { employeeProps } from "../utils/types";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks";
import { saveEmployeesAction } from "../redux/employees";
import { EMPLOYEES } from "../utils/endpoints";
import { profileEnums } from "../utils/enums";

const Employees = () => {
  const navigate = useNavigate();
  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );
  const { t } = useTranslation();
  const [editData, setEditData] = useState<null | employeeProps>(null);
  const [showPay, setShowPay] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { get } = useApi();
  const dispatch = useDispatch();
  useEffect(() => {
    get({ url: EMPLOYEES.getAll }).then((res) => {
      console.log("Get all employees: ", res);
      if (Array.isArray(res)) {
        dispatch(saveEmployeesAction(res));
      }
    });
  }, []);

  const handleRowEdit = (row: employeeProps) => {
    setEditData(row);
    setShowEdit(true);
  };

  const columns: GridColDef[] =
    !employees || employees?.length <= 0
      ? []
      : createDataColumns(employees[0], (s: string) => t("AddEmployee." + s));

  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns.map((col) =>
        col.field === "created_Date"
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
          : col.field === "name"
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
            <Tooltip key={1} title={t("common.edit")}>
              <GridActionsCellItem
                icon={<FaRegEdit size={16} />}
                label="Edit"
                sx={{ color: "primary.main" }}
                onClick={() => handleRowEdit(row)}
              />
            </Tooltip>,
            <Tooltip key={2} title={t("common.show")}>
              <GridActionsCellItem
                icon={<FaEye size={16} />}
                label="show"
                sx={{ color: "primary.main" }}
                onClick={() =>
                  navigate(
                    `/employee-details?id=${id}&name=${row.name}&salary=${row.salary}&total=${row.total}`
                  )
                }
              />
            </Tooltip>,
            <Tooltip key={"Pay"} title={t("PayEmployee.pay")}>
              <GridActionsCellItem
                icon={<MdOutlineAttachMoney size={16} />}
                label="pay"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  setEditData(row);
                  setShowPay(true);
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
        <AddEmployee
          showButtonTitle
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
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
          rows={employees || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default Employees;
