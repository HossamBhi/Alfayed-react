import Box from "@mui/material/Box";

import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdAddCircleOutline, MdClose, MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { createDataColumns } from "../../utils/helper";
import { CustomButton } from "../common";
import { productListProps } from "../../utils/types";
import { clientProductStaus } from "../../utils/enums";

interface EditToolbarProps {
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

export default function EditableTable({
  productList,
  setProductList,
}: {
  productList: productListProps[];
  setProductList: (p: any) => void;
}) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const products = useSelector((state: RootState) => state.stock.products);
  const productsArr: string[] = products.reduce((prev: string[], curr) => {
    return [...prev, curr.name];
  }, []);
  const [rowsLeng, setRowsLength] = useState(1);

  function EditToolbar(props: EditToolbarProps) {
    const { setRowModesModel } = props;
    const handleClick = () => {
      setRowsLength(rowsLeng + 1);
      setProductList([
        ...productList,
        {
          id: rowsLeng,
          productID: 0,
          productName: "",
          productBoxID: 0,
          productBoxName: "",
          quantity: "",
          number: "",
          price: "",
          total: "",
          isNew: true,
          statusID: clientProductStaus.new,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [rowsLeng]: { mode: GridRowModes.Edit, fieldToFocus: "productName" },
      }));
    };

    return (
      <GridToolbarContainer>
        <CustomButton
          variant="contained"
          startIcon={<MdAddCircleOutline />}
          onClick={handleClick}
        >
          اضف صنف
        </CustomButton>
      </GridToolbarContainer>
    );
  }

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const findIndex = productList.findIndex((row) => row.id === id);
    console.log({findIndex})
    const newList = productList;
    newList[findIndex] = {
      ...newList[findIndex],
      statusID: clientProductStaus.deleted,
    };

    setProductList(newList);
    // setProductList(productList.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = productList.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setProductList(productList.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = {
      ...newRow,
      isNew: false,
      statusID:
        newRow.statusID === clientProductStaus.new
          ? clientProductStaus.new
          : clientProductStaus.updated,
      productID: products.find((item) => item.name == newRow.productName)?.id,
      productBoxID: products.find((item) => item.name == newRow.productBoxName)
        ?.id,
    };
    setProductList(
      productList.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns: GridColDef[] =
    !productList || productList?.length <= 0
      ? []
      : createDataColumns(productList[0], (s: string) =>
          t("client.prodcutList." + s)
        );
  const customeColumns = useMemo(() => {
    if (columns.length <= 0) return columns;
    return [
      ...columns
        .filter((col) => !["isNew"].includes(col.field))
        .map((col) =>
          ["productName", "productBoxName"].includes(col.field)
            ? {
                ...col,
                width: 200,
                type: "singleSelect",
                valueOptions: productsArr,
                editable: true,
              }
            : ["id", "productBoxID", "productID"].includes(col.field)
            ? {
                ...col,
                width: 50,
                editable: false,
              }
            : { ...col, width: 100, editable: true }
        ),
      {
        field: "actions",
        type: "actions",
        headerName: t("table.actions"),
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }: GridValueGetterParams) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<FaSave size={18} />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<MdClose size={18} />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<MdEdit size={18} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<MdDelete size={18} />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ];
  }, [columns]);

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        showCellVerticalBorder
        showColumnVerticalBorder
        columnVisibilityModel={{
          // id: false,
          productID: false,
          productBoxID: false,
        }}
        rows={productList.filter(
          (item) => item.statusID !== clientProductStaus.deleted
        )}
        columns={customeColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRowModesModel },
        }}
        getRowId={(item) => item.id}
      />
    </Box>
  );
}
