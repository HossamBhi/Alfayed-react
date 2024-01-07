import { createSlice } from "@reduxjs/toolkit";

let initialState: {
  total: string | number | null;
  transactions: any[];
} = { total: null, transactions: [] };

const accounts = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    saveTransactionsAction: (state, { payload }) => {
      state.transactions = payload;
    },
    saveTotalAction: (state, { payload }) => {
      state.total = payload;
    },
  },
});

export const { saveTotalAction, saveTransactionsAction } = accounts.actions;

export default accounts.reducer;
