import { createSlice } from "@reduxjs/toolkit";

const initialState: null | { name: string; token: string } = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAction: (state, action) => action.payload,
    logOutAction: () => initialState,
  },
});

export const { setUserAction, logOutAction } = userSlice.actions;
export default userSlice.reducer;
