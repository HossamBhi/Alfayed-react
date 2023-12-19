import { createSlice } from "@reduxjs/toolkit";
import { ThemeProps, _getAppThemes } from "../utils/appDB";
import { ReactNode } from "react";

const initialState: {
  activeLanguage: ThemeProps | null;
  activeTheme: ThemeProps;
  languages: ThemeProps[];
  isLoad?: boolean;
  Popup: {
    options: {
      dismissable: true;
      showClose: true;
      useScrollView: false;
      cardStyle: null;
      scrollViewStyle: null;
      scrollViewContainerStyle: null;
      onClose: null;
    };
    component: null | ReactNode;
  };
} = {
  activeTheme: _getAppThemes()[0],
  activeLanguage: null,
  languages: [],
  isLoad: false,
  Popup: {
    component: null,
    options: {
      dismissable: true,
      showClose: true,
      useScrollView: false,
      cardStyle: null,
      scrollViewStyle: null,
      scrollViewContainerStyle: null,
      onClose: null,
    },
  },
};

const appSettings = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setLanguagesAction: (state, { payload }) => {
      state.languages = payload;
    },
    // changeThemeAction: (state, {payload}) => {
    //   state.activeTheme = payload;
    // },
    changeLanguageAction: (state, { payload }) => {
      state.activeLanguage = payload;
    },
    showPopup: (state, { payload }) => {
      state.Popup = payload;
    },
    hidePopup: (state) => {
      state.Popup = {
        component: null,
        options: {
          dismissable: true,
          showClose: true,
          useScrollView: false,
          cardStyle: null,
          scrollViewStyle: null,
          scrollViewContainerStyle: null,
          onClose: null,
        },
      };
    },
    showLoader: (state) => {
      state.isLoad = true;
    },
    hideLoader: (state) => {
      state.isLoad = false;
    },
  },
});

export const {
  changeLanguageAction,
  setLanguagesAction,
  showPopup,
  hidePopup,
  showLoader,
  hideLoader,
} = appSettings.actions;
export default appSettings.reducer;
