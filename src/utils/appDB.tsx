import { t } from "i18next";

export const _getAppThemes = () => [
  { id: 1, name: t("defaultTheme") },
  { id: 2, name: t("darkTheme") },
  { id: 3, name: t("lightTheme") },
];

export type ThemeProps = {
  id: string | number;
  name: string;
  rtl?: 0 | 1;
  code?: string;
};
export const _getAppLanguages = () => [
  // {value: 'ar', label: t('arabic'), direction: 'rtl'},
  // {value: 'en', label: t('english'), direction: 'ltr'},
];

export const DISCOUNT_TYPES = () => [
  { id: 1, name: t("AddToStock.discountPercentage") },
  { id: 2, name: t("AddToStock.discountFlat") },
];
