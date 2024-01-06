import { createSlice } from "@reduxjs/toolkit";

let initialState: {
  accounts: { total: string | number | null };
} = { accounts: { total: null } };

const accounts = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    saveAccountsAction: (state, { payload }) => {
      state.accounts = payload;
    },
  },
});

export const { saveAccountsAction } = accounts.actions;

export default accounts.reducer;
