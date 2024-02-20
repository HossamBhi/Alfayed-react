import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { CustomTable } from "../components/common";
import { AddFridge, PayForm } from "../components/popups";
import { RootState } from "../redux/store";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";
import { fridgeProps } from "../utils/types";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { profileEnums } from "../utils/enums";

const Fridges = () => {
  const navigate = useNavigate();
  const fridges = useSelector((state: RootState) => state.fridges.fridges);
  const { t } = useTranslation();
  const [editData, setEditData] = useState<null | fridgeProps>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPay, setShowPay] = useState(false);

  const handleRowEdit = (row: fridgeProps) => {
    setEditData(row);
    setShowEdit(true);
  };

  const columns: GridColDef[] =
    !fridges || fridges?.length <= 0
      ? []
      : createDataColumns(fridges[0], (s: string) => t("fridges." + s));

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
                onClick={() => navigate("/fridge-details?id=" + id)}
              />
            </Tooltip>,
            <Tooltip key={"Pay"} title={t("payForm.pay")}>
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
        <AddFridge
          showButtonTitle
          editData={editData}
          setEditData={(data) => setEditData(data)}
          show={showEdit}
          onClose={() => setShowEdit(false)}
          onShowClick={() => setShowEdit(true)}
        />
      </div>
      <PayForm
        hideShowBtn
        editData={editData}
        setEditData={(data) => setEditData(data)}
        show={showPay}
        onClose={() => setShowPay(false)}
        onShowClick={() => setShowPay(true)}
        type={profileEnums.fridges}
      />
      <div className="grid grid-cols-1">
        <CustomTable
          rows={fridges || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default Fridges;
