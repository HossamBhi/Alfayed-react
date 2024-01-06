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
import { FaRegEdit } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCard } from "../components/cards";
import { CustomTable } from "../components/common";
import { AddFarm, AddFridge } from "../components/popups";
import PayEmployee from "../components/popups/PayEmployee";
import { useApi } from "../hooks";
import { FRIDGES } from "../utils/endpoints";
import { createDataColumns, formatDate } from "../utils/helper";
import { fridgeDataProps, fridgeProps } from "../utils/types";
import { RiFridgeFill } from "react-icons/ri";

const FridgeDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [showEdit, setShowEdit] = useState(false);
  // const [id, setId] = useState<null | string>(null);
  const { get } = useApi();
  const [details, setDetails] = useState<null | fridgeProps>(null);
  const [detailsData, setDetailsData] = useState<null | fridgeDataProps[]>(
    null
  );

  useEffect(() => {
    if (id != null) {
      get({ url: FRIDGES.getRecordWithData, params: { fridgeId: id } }).then(
        (res) => {
          console.log("fridge data get Record With Data", { res });
          if (!res.status) {
            setDetails(res);
            setDetailsData(res.fridgeRecords);
          } else {
            setDetailsData([]);
            alert("Error " + res.status + ": " + res.data);
          }
        }
      );
    }
  }, [id]);

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
            col.field != "typeId"
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
                width: 150,
                type: "date",
                align: "center",
                headerAlign: "center",
                valueFormatter: (params: GridValueFormatterParams) =>
                  formatDate(params.value),
                valueGetter: (params: GridValueGetterParams) =>
                  formatDate(params.value),
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
                  console.log({ props });

                  return (
                    <p
                      className={`py-1 px-4 rounded-md text-white ${
                        row.action === 1 ? "bg-primary" : "bg-blue-700"
                      }`}
                    >{`${value}`}</p>
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
          const { id } = params;
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
        {id != null && (
          <UserCard
            item={details}
            containerStyle={"bg-white hover:bg-white mt-0"}
            showEdit
            Icon={RiFridgeFill}
            onEdit={() => setShowEdit(true)}
            onClick={() => setShowEdit(true)}
          />
        )}
        {/* <PayEmployee
          showButtonTitle
          // hideShowBtn
          // editData={editData}
          // setEditData={(data) => setEditData(data)}
          // show={showPay}
          // onClose={() => setShowPay(false)}
          // onShowClick={() => setShowPay(true)}
        /> */}
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
          rows={detailsData || []}
          columns={customeColumns as any}
          getRowId={(item) => item.fridgeRecordID}
        />
      </div>
    </main>
  );
};

export default FridgeDetails;
