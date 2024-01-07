import { CustomButton, CustomTable } from "../components/common";
import { useApi } from "../hooks";
import { STORE } from "../utils/endpoints";
import { createDataColumns } from "../utils/helper";
import { supplierProps } from "../utils/types";
import { Tooltip } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

const Accounts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const transactions = useSelector(
    (state: RootState) => state.accounts.transactions
  );
  // console.log(transactions);
  // const { get } = useApi();
  // const [tableData, setTableData] = useState<null | supplierProps[]>(null);
  // useEffect(() => {
  //   get({ url: STORE.getAll }).then((res) => {
  //     console.log("STORE.getAll", { res });
  //     // if (Array.isArray(res)) {
  //     if (!res.status || Array.isArray(res)) {
  //       setTableData(res);
  //     } else {
  //       setTableData([]);
  //       alert("Error " + res.status + ": " + res.data);
  //     }
  //   });
  // }, []);

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
        .filter((col) => !["safeID"].includes(col.field))
        // col.field !== "productID" && col.field !== "notes")
        .map((col) =>
          col.field === "productName"
            ? { ...col, width: 200 }
            : col.field === "quantity"
            ? { ...col, width: 200 }
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
            <Tooltip key={id} title={t("common.show")}>
              <GridActionsCellItem
                icon={<FaEye size={16} />}
                label={t("common.show")}
                sx={{ color: "primary.main" }}
                onClick={() => navigate("/products")}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }, [columns]);
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-2">
      <div className="bg-background-card p-4 rounded-md border"></div>
      {/* <div className="mb-4">
        <CustomButton
          variant="contained"
          onClick={() => navigate("/add-to-stock")}
        >
          <BsFillPlusCircleFill className="me-4" /> {t("menu.addToStock")}
        </CustomButton>
      </div> */}

      <div className="grid grid-cols-1">
        <CustomTable
          columnVisibilityModel={{
            action: false,
            clientName: false,
            clientID: false,
            empID: false,
            expenseID: false,
            farmID: false,
            fridgeID: false,
            id: false,
            type: false,
            typeID: false,
          }}
          rows={transactions || []}
          columns={customeColumns as any}
          getRowId={(item) => item.id}
        />
      </div>
    </main>
  );
};

export default Accounts;
