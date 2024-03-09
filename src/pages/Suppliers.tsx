import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { CustomTable } from "../components/common";
import { AddFarm, PayForm } from "../components/popups";
import { RootState } from "../redux/store";
import {
  convertArrayToKeyObject,
  createDataColumns,
  formatDateTime,
  sortByCreatedDate,
} from "../utils/helper";
import { supplierProps } from "../utils/types";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks";
import { saveSuppliersAction } from "../redux/suppliers";
import { SUPPLIERS } from "../utils/endpoints";
import { apiResponseStatus, profileEnums } from "../utils/enums";

const Suppliers = () => {
  const navigate = useNavigate();
  const { get } = useApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const suppliersArray = useMemo(
    () => sortByCreatedDate(Object.values(suppliers || {})),
    [suppliers]
  );

  const [editData, setEditData] = useState<null | supplierProps>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 0,
  });
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    get({
      url: SUPPLIERS.getAll,
      params: {
        pageNumber: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      },
    }).then((res) => {
      console.log("SUPPLIERS.getAll: ", { res });
      if (res.responseID === apiResponseStatus.success) {
        setLastPage(res.lastPage);
        dispatch(
          saveSuppliersAction(convertArrayToKeyObject(res.responseValue, "id"))
        );
      }
    });
  }, [paginationModel]);

  const handleRowEdit = (row: supplierProps) => {
    setEditData(row);
    setShowEdit(true);
  };

  const columns: GridColDef[] =
    !suppliersArray || suppliersArray?.length <= 0
      ? []
      : createDataColumns(suppliersArray[0], (s: string) => t("table." + s));

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
                onClick={() => navigate("/farm-details?id=" + id)}
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
        <AddFarm
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
        type={profileEnums.suppliers}
      />
      <div className="grid grid-cols-1">
        <CustomTable
          rowCount={paginationModel.pageSize * lastPage}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={suppliersArray || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default Suppliers;
