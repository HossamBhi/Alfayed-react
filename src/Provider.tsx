import store from "./redux/store";
// import i18n from "@/langs";
import { cacheLrt, cacheRtl, lightTheme } from "./utils/schema";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import { ReactNode, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
const Provider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  console.log({ children });
  useLayoutEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n]);
  return (
    <BrowserRouter>
      <CacheProvider value={i18n.dir() === "rtl" ? cacheRtl : cacheLrt}>
        <ReduxProvider store={store}>
          {/* <PersistGate loading={null} persistor={persistStore(store)}> */}
          <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
          {/* </PersistGate> */}
        </ReduxProvider>
      </CacheProvider>
    </BrowserRouter>
  );
};

export default Provider;
