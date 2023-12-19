import { CustomTable } from "../components/common";
import AddClient from "../components/popups/AddClient";
import { RootState } from "../redux/store";
import { createDataColumns, formatDate } from "../utils/helper";
import { clientProps, supplierProps } from "../utils/types";
import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();
  const clients = useSelector((state: RootState) => state.clients);
  const { t } = useTranslation();
  const [editData, setEditData] = useState<null | clientProps>(null);
  const [showEdit, setShowEdit] = useState(false);

  const handleRowEdit = (row: supplierProps) => {
    setEditData(row);
    setShowEdit(true);
  };

  const columns: GridColDef[] =
    !clients || clients?.length <= 0
      ? []
      : createDataColumns(clients[0], (s: string) => t("table." + s));

  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns.map((col) =>
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
                onClick={() => navigate("/client-detials?id=" + id)}
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
        <AddClient
          showButtonTitle
          editData={editData}
          setEditData={(data) => setEditData(data)}
          show={showEdit}
          onClose={() => setShowEdit(false)}
          onShowClick={() => setShowEdit(true)}
        />
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
          rows={clients || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default Clients;
