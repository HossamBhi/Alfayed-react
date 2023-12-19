import i18n from "i18next";
import backend from "i18next-http-backend";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { ar } from "./ar";
import { en } from "./en";

const resources = { en, ar };
export const isRTL = () => i18n.dir() === "rtl";
export const APP_LANG = () => (isRTL() ? "ar" : "en");

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: APP_LANG(), // use en if detected lng is not available
    // keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const LANGUAGES = [
  { label: "En", code: "en", direction: "ltr" },
  { label: "ع", code: "ar", direction: "rtl" },
];

export default i18n;
