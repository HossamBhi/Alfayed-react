import { createSlice } from "@reduxjs/toolkit";
import { supplierProps } from "../utils/types";

let initialState: { [key: number | string]: supplierProps } = {};
// let initialState: supplierProps[] = [];

const suppliers = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    saveSuppliersAction: (state, { payload }) => ({ ...state, ...payload }),
    saveSupplierDataAction: (state, { payload }) => {
      const { data, id } = payload;
      state[id].offlineRecords = data;
      // state[id].offlineRecords = { ...state[id].offlineRecords, ...data };
    },
    addSupplierAction: (state, { payload }) => {
      // if (state === null) {
      //   return state;
      // }
      state[payload.id] = payload;
      // if (Array.isArray(state)) {
      //   state?.unshift(payload);
      // }
    },
    editSupplierAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
      // const findIndex = state?.findIndex(
      //   (item: supplierProps) => item.id === payload.id
      // );
      state[payload.id] = payload;
    },
  },
});

export const {
  saveSupplierDataAction,
  saveSuppliersAction,
  addSupplierAction,
  editSupplierAction,
} = suppliers.actions;

export default suppliers.reducer;
