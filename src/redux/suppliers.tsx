import { createSlice } from "@reduxjs/toolkit";
import { supplierProps } from "../utils/types";

let initialState: supplierProps[] = [];
// let initialState: any | supplierProps[] = null;

const suppliers = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    saveSuppliersAction: (state, { payload }) => payload,
    addSupplierAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
      if (Array.isArray(state)) {
        state?.unshift(payload);
      }
    },
    editSupplierAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
      const findIndex = state?.findIndex(
        (item: supplierProps) => item.id === payload.id,
      );
      state[findIndex] = payload;
    },
  },
});

export const { saveSuppliersAction, addSupplierAction, editSupplierAction } =
  suppliers.actions;

export default suppliers.reducer;
