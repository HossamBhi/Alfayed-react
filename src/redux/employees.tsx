import { createSlice } from "@reduxjs/toolkit";
import { employeeProps } from "../utils/types";

let initialState: { employees: employeeProps[] } = { employees: [] };

const employees = createSlice({
  name: "employees",
  initialState,
  reducers: {
    saveEmployeesAction: (state, { payload }) => {
      state.employees = payload;
    },
    addEmployeeAction: (state, { payload }) => {
      state.employees.unshift(payload);
    },
    editEmployeeAction: (state, { payload }) => {
      const findIndex = state?.employees.findIndex(
        (item: employeeProps) => item.id === payload.id
      );
      state.employees[findIndex] = payload;
    },
  },
});

export const { addEmployeeAction, saveEmployeesAction, editEmployeeAction } =
  employees.actions;

export default employees.reducer;
