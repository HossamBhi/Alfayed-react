import createCache from "@emotion/cache";
import { createTheme } from "@mui/material";
import { arSD } from "@mui/x-data-grid";
import rtlPlugin from "stylis-plugin-rtl";
import i18n from "../langs";
// import i18n from "./localization";
// import { prefixer } from "stylis";

const primary_color = "#266937";
// const dark = "#003ba0";
// const light = "#6191ff";

export const lightTheme = createTheme(
  {
    palette: {
      primary: { main: primary_color },
      secondary: {
        main: "#1D7CB4", // surfaceVariant: '#F1F3F7',
        light: "#B8B8B8", // onSurfaceVariant: '#B8B8B8',
      },
      text: { primary: "#000", secondary: "#8D8D8D" },
    },

    direction: i18n.dir(),
  },
  arSD,
);

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: primary_color },
    secondary: {
      main: "#F1F3F7", // surfaceVariant: '#F1F3F7',
      light: "#B8B8B8", // onSurfaceVariant: '#B8B8B8',
    },
    text: { primary: "#000", secondary: "#8D8D8D" },
  },
  direction: i18n.dir(),
});

// Create rtl cache
export const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});
export const cacheLrt = createCache({
  key: "muilrt",
  stylisPlugins: [],
});
