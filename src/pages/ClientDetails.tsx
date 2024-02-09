import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaRegEdit, FaUserTie } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserCard } from "../components/cards";
import { CustomTable } from "../components/common";
import AddClient from "../components/popups/AddClient";
import { useApi } from "../hooks";
import { CLIENT } from "../utils/endpoints";
import { createDataColumns, formatDate } from "../utils/helper";
import { clientProps } from "../utils/types";

const ClientDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [showEdit, setShowEdit] = useState(false);
  // const [id, setId] = useState<null | string>(null);
  const { get } = useApi();
  const [client, setClient] = useState<null | clientProps>(null);
  const [clientData, setClientData] = useState<null | any[]>(null);

  useEffect(() => {
    if (id != null) {
      get({ url: CLIENT.getRecordWithData, params: { clientID: id } }).then(
        (res: any) => {
          console.log("CLIENT.getRecordWithData", { res });
          // if (Array.isArray(res)) {
          if (!res.status) {
            setClient(res);
            setClientData(res.transactionsList);
          } else {
            setClientData([]);
            toast.error("Error " + res.status + ": " + res.data);
            // alert("Error " + res.status + ": " + res.data);
          }
        }
      );
    }
  }, [id]);

  const columns: GridColDef[] =
    !clientData || clientData?.length <= 0
      ? []
      : createDataColumns(clientData[0], (s: string) => t("client." + s));
 
  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns
        .filter(
          (col) =>
            !["clientID", "clientName", "productList"].includes(col.field)
        )
        .map((col) =>
          ["createdDate", "date", "payDate"].includes(col.field)
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
            : col.field === "typeId"
            ? {
                ...col,
                width: 120,
                headerName: t("supplierTable.description"),
                renderCell: (props: GridRenderCellParams<any, Date>) => (
                  <p
                    className={`py-1 px-4 rounded-md text-white ${"bg-green-700"}`}
                  >{`${t("payForm.payType3")}`}</p>
                ),
              }
            : col
        ),
      {
        field: "action",
        headerName: t("table.actions"),
        width: 150,
        type: "actions",
        getActions: (params: any) => {
          const { id, row } = params;
          if (row.description === "Pay") return [];
          return [
            <Tooltip key={id} title={t("common.edit")}>
              <GridActionsCellItem
                icon={<FaRegEdit size={16} />}
                label="Edit"
                sx={{ color: "primary.main" }}
                onClick={() =>
                  navigate(
                    `/send-to-client?clientID=${row.clientID}&clientName=${row.clientName}&id=${id}`
                  )
                }
              />
            </Tooltip>,
            <Tooltip key={2} title={t("common.show")}>
              <GridActionsCellItem
                icon={<FaEye size={16} />}
                label="show"
                sx={{ color: "primary.main" }}
                onClick={() => toast.info("قريبا")}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }, [columns]);

  if (id === null || !client || !clientData) {
    return (
      <main className="flex min-h-screen flex-col">
        {/* <LinearProgress
          sx={{ minWidth: "100%" }}
          className="absolute top-0 rounded"
        /> */}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="m-0">
        {id != null && (
          <UserCard
            item={client}
            containerStyle={"bg-white hover:bg-white mt-0"}
            showEdit
            Icon={FaUserTie}
            onEdit={() => setShowEdit(true)}
            onClick={() => setShowEdit(true)}
          />
        )}
        <AddClient
          hideShowBtn={true}
          editData={client}
          setEditData={(data) => setClient(data)}
          show={showEdit}
          onClose={() => setShowEdit(false)}
        />
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
          rows={clientData || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default ClientDetails;
