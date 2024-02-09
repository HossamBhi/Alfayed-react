import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./user";
import appSettings from "./appSettings";
import suppliers from "./suppliers";
import expenses from "./expenses";
import clients from "./clients";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import employees from "./employees";
import accounts from "./accounts";
import fridges from "./fridges";
import stock from "./stock";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const appReducer = combineReducers({
  user,
  appSettings,
  suppliers,
  expenses,
  clients,
  employees,
  accounts,
  fridges,
  stock,
});

const rootReducers = (state: any, action: any) => {
  if (action.type === "user/logOutAction") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducers);
export type RootState = ReturnType<typeof rootReducers>;
export type AppDispatch = typeof store.dispatch;
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
