import { clientProps } from "../utils/types";
import { createSlice } from "@reduxjs/toolkit";

let initialState: clientProps[] = [];
// let initialState: any | supplierProps[] = null;

const clients = createSlice({
  name: "clients",
  initialState,
  reducers: {
    saveClientsAction: (state, { payload }) => payload,
    addClientAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
      if (Array.isArray(state)) {
        state?.unshift(payload);
      }
    },
    editClientAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
      const findIndex = state?.findIndex(
        (item: clientProps) => item.id === payload.id,
      );
      state[findIndex] = payload;
    },
  },
});

export const { saveClientsAction, addClientAction, editClientAction } =
  clients.actions;

export default clients.reducer;
