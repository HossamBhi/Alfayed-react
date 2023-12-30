import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./user";
import appSettings from "./appSettings";
import suppliers from "./suppliers";
import expenses from "./expenses";
import clients from "./clients";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import employees from "./employees";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducers = combineReducers({
  user,
  appSettings,
  suppliers,
  expenses,
  clients,
  employees,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);
export type RootState = ReturnType<typeof rootReducers>;
export type AppDispatch = typeof store.dispatch;
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
