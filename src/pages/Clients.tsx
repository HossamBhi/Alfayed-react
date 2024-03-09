import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomTable } from "../components/common";
import { PayForm } from "../components/popups";
import AddClient from "../components/popups/AddClient";
import { RootState } from "../redux/store";
import { profileEnums } from "../utils/enums";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";
import { clientProps, supplierProps } from "../utils/types";
import { BsSendPlusFill } from "react-icons/bs";

const Clients = () => {
  const navigate = useNavigate();
  const clients = useSelector((state: RootState) => state.clients);
  const { t } = useTranslation();
  const [editData, setEditData] = useState<null | clientProps>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPay, setShowPay] = useState(false);
  // const { get } = useApi();
  
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 0,
  });
  const [lastPage, setLastPage] = useState(1);
  // const suppliersArray = useMemo(
  //   () => sortByCreatedDate(Object.values(suppliers || {})),
  //   [suppliers]
  // );

  // useEffect(() => {
  //   get({
  //     url: SUPPLIERS.getAll,
  //     params: {
  //       pageNumber: paginationModel.page + 1,
  //       pageSize: paginationModel.pageSize,
  //     },
  //   }).then((res) => {
  //     console.log("SUPPLIERS.getAll: ", { res });
  //     if (res.responseID === apiResponseStatus.success) {
  //       setLastPage(res.lastPage);
  //       dispatch(
  //         saveSuppliersAction(convertArrayToKeyObject(res.responseValue, "id"))
  //       );
  //     }
  //   });
  // }, [paginationModel]);

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
        col.field === "created_Date"
          ? {
              ...col,
              width: 180,
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
            // <div className="w-full flex flex-col">
            <>
              <Tooltip key={1} title={t("common.edit")}>
                <GridActionsCellItem
                  icon={<FaRegEdit size={16} />}
                  label="Edit"
                  sx={{ color: "primary.main" }}
                  onClick={() => handleRowEdit(row)}
                />
              </Tooltip>
              <Tooltip key={2} title={t("common.show")}>
                <GridActionsCellItem
                  icon={<FaEye size={16} />}
                  label="show"
                  sx={{ color: "primary.main" }}
                  onClick={() => navigate("/client-details?id=" + id)}
                />
              </Tooltip>
            </>,
            // </div>
            // <div className="w-full flex flex-col">
            <>
              <Tooltip key={"income"} title={t("payForm.income")}>
                <GridActionsCellItem
                  icon={<MdOutlineAttachMoney size={16} />}
                  label="income"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    setEditData(row);
                    setShowPay(true);
                  }}
                />
              </Tooltip>
              <Tooltip key={"send"} title={t("client.sendTo")}>
                <GridActionsCellItem
                  icon={<BsSendPlusFill size={16} />}
                  label="send"
                  sx={{ color: "primary.main" }}
                  onClick={() =>
                    navigate(
                      `/send-to-client?clientID=${id}&clientName=${row.name}`
                    )
                  }
                />
              </Tooltip>
            </>,
            // </div>
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
      <PayForm
        hideShowBtn
        editData={editData}
        setEditData={(data) => setEditData(data)}
        show={showPay}
        onClose={() => setShowPay(false)}
        onShowClick={() => setShowPay(true)}
        type={profileEnums.clients}
      />
      <div className="grid grid-cols-1">
        <CustomTable
          rowCount={lastPage * paginationModel.pageSize}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={clients || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default Clients;
