import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store from "./redux/store";
import { cacheRtl, lightTheme } from "./utils/schema";
const persistor = persistStore(store);

const Provider = () => {
  // const { i18n } = useTranslation();
  // useLayoutEffect(() => {
  //   document.body.dir = i18n.dir();
  // }, [i18n.dir()]);
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CacheProvider value={cacheRtl}>
          {/* <CacheProvider value={i18n.dir() === "rtl" ? cacheRtl : cacheLrt}> */}
          <ThemeProvider theme={lightTheme}>
            <App />
          </ThemeProvider>
        </CacheProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default Provider;
