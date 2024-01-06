import { fridgeProps } from "../utils/types";
import { createSlice } from "@reduxjs/toolkit";

let initialState: {
  fridges: fridgeProps[];
} = { fridges: [] };

const fridges = createSlice({
  name: "fridges",
  initialState,
  reducers: {
    saveFridgesAction: (state, { payload }) => {
      state.fridges = payload;
    },
    addFridgeAction: (state, { payload }) => {
      if (Array.isArray(state?.fridges)) {
        state?.fridges?.unshift(payload);
      }
    },
    editFridgeAction: (state, { payload }) => {
      const findIndex = state?.fridges?.findIndex(
        (item: fridgeProps) => item.id === payload.id
      );
      state.fridges[findIndex] = payload;
    },
  },
});

export const { saveFridgesAction, addFridgeAction, editFridgeAction } =
  fridges.actions;

export default fridges.reducer;
