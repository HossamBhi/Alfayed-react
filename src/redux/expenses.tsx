import { expenseProps, expenseTypesProps } from "../utils/types";
import { createSlice } from "@reduxjs/toolkit";

let initialState: {
  expenses: expenseProps[];
  expensesTypes: expenseTypesProps[];
} = { expenses: [], expensesTypes: [] };
// let initialState: any | supplierProps[] = null;

const expenses = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    saveExpensesAction: (state, { payload }) => {
      state.expenses = payload;
    },
    addExpenseAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
  
      if (Array.isArray(state?.expenses)) {
        state?.expenses?.unshift(payload);
      }
    },
    editExpenseAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
      const findIndex = state?.expenses?.findIndex(
        (item: expenseProps) => item.id === payload.id,
      );
      state.expenses[findIndex] = payload;
    },
    saveExpensesTypesAction: (state, { payload }) => {
      state.expensesTypes = payload;
    },
    addExpenseTypeAction: (state, { payload }) => {
      if (state === null) {
        return state;
      }
     
      if (Array.isArray(state?.expensesTypes)) {
        state?.expensesTypes?.unshift(payload);
      }
    },
  },
});

export const {
  saveExpensesAction,
  addExpenseAction,
  editExpenseAction,
  addExpenseTypeAction,
  saveExpensesTypesAction,
} = expenses.actions;

export default expenses.reducer;
