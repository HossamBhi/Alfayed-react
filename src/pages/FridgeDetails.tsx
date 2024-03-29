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
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { RiFridgeFill } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCard } from "../components/cards";
import { CustomTable } from "../components/common";
import { AddFridge, PopupButton } from "../components/popups";
import { useApi } from "../hooks";
import { FRIDGES } from "../utils/endpoints";
import { createDataColumns, formatDate, formatDateTime } from "../utils/helper";
import { fridgeDataProps, fridgeProps } from "../utils/types";
import { apiResponseStatus } from "../utils/enums";
import { toast } from "react-toastify";

const FridgeDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [showEdit, setShowEdit] = useState(false);
  // const [id, setId] = useState<null | string>(null);
  const { get } = useApi();
  const [details, setDetails] = useState<null | fridgeProps>(null);
  const [detailsData, setDetailsData] = useState<null | fridgeDataProps[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 0,
  });
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    if (id !== null) {
      get({
        url: FRIDGES.getRecordWithData,
        params: {
          fridgeId: id,
          pageNumber: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
        },
      }).then((res) => {
        console.log("fridge data get Record With Data", { res });
        if (res.responseValue) {
          // if (res.responseID === apiResponseStatus.success) {
          setLastPage(res.lastPage);
          setDetails(res.responseValue);
          setDetailsData(res.responseValue.fridgeRecords);
        } else {
          toast.warning(res.responseMessage);
          // setDetailsData([]);
          // alert("Error " + res.status + ": " + res.data);
        }
      });
    }
  }, [id, paginationModel]);

  const columns: GridColDef[] =
    !detailsData || detailsData?.length <= 0
      ? []
      : createDataColumns(detailsData[0], (s: string) => t("fridges." + s));

  const customeColumns = useMemo(() => {
    if (columns?.length <= 0) {
      return [];
    }

    return [
      ...columns
        .filter(
          (col) =>
            col.field !== "fridgeID" &&
            col.field !== "productID" &&
            col.field !== "action" &&
            col.field !== "description" &&
            col.field !== "typeId"
          // &&
          // col.field !== "created_Date"
        )
        .map((col) =>
          col.field === "supplyDate"
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
            : col.field === "created_Date"
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
            : col.field === "notes"
            ? { ...col, width: 200 }
            : col.field === "actionName"
            ? {
                ...col,
                width: 120,
                headerName: t("fridges.actionName"),
                renderCell: (props: GridRenderCellParams<any, Date>) => {
                  const { row, value } = props;
                  return (
                    <p
                      className={`py-1 px-4 rounded-md text-white ${
                        row.action === 1 ? "bg-primary" : "bg-blue-700"
                      }`}
                    >{`${
                      row.action === 1
                        ? t("fridges.in")
                        : row.action === 2
                        ? t("fridges.out")
                        : t("payForm.payType1")
                    } `}</p>
                  );
                },
              }
            : col
        ),
      {
        field: "action",
        headerName: t("table.actions"),
        width: 150,
        type: "actions",
        getActions: (params: any) => {
          const { row, id } = params;
          if (row.action === null) return [];
          return [
            <Tooltip key={id} title={t("common.edit")}>
              <GridActionsCellItem
                icon={<FaRegEdit size={16} />}
                label="Edit"
                sx={{ color: "primary.main" }}
                onClick={() => navigate("/add-to-fridge?id=" + id)}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }, [columns]);

  if (id === null || !details || !detailsData) {
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
        {id !== null && (
          <UserCard
            item={details}
            containerStyle={"bg-white hover:bg-white mt-0"}
            showEdit
            Icon={RiFridgeFill}
            onEdit={() => setShowEdit(true)}
            onClick={() => setShowEdit(true)}
          />
        )}
        <div className="flex flex-1 justify-end w-full">
          <PopupButton
            className="!mb-2"
            onClick={() =>
              navigate(
                `/add-to-fridge?fridgeID=${id}&fridgeName=${details.name}`
              )
            }
          >
            <BsFillPlusCircleFill className="me-4" /> {t("fridges.addToTitle")}
          </PopupButton>
        </div>
        <AddFridge
          hideShowBtn={true}
          editData={details}
          setEditData={(data) => setDetails(data)}
          show={showEdit}
          onClose={() => setShowEdit(false)}
        />
      </div>

      <div className="grid grid-cols-1">
        <CustomTable
          rowCount={paginationModel.pageSize * lastPage}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={detailsData || []}
          columns={customeColumns as any}
          getRowId={(item) => item.fridgeRecordID}
        />
      </div>
    </main>
  );
};

export default FridgeDetails;
