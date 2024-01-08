import { createSlice } from "@reduxjs/toolkit";
import { productProps, stockProps } from "../utils/types";

let initialState: {
  stock: stockProps[];
  products: productProps[];
  productsDetails: productProps[];
} = { stock: [], products: [], productsDetails: [] };

const stock = createSlice({
  name: "stock",
  initialState,
  reducers: {
    saveStockAction: (state, { payload }) => {
      state.stock = payload;
    },
    // addStockAction: (state, { payload }) => {
    //   state?.stock?.unshift(payload);
    // },
    editStockAction: (state, { payload }) => {
      const findIndex = state.stock.findIndex(
        (item: stockProps) => item.productID === payload.productID
      );
      state.stock[findIndex] = payload;
    },
    saveProductsAction: (state, { payload }) => {
      state.products = payload;
    },
    addProductAction: (state, { payload }) => {
      state?.products?.unshift(payload);
    },
    editProductAction: (state, { payload }) => {
      const findIndex = state.products.findIndex(
        (item: productProps) => item.productID === payload.productID
      );
      console.log({ findIndex, products: state.products[0], id: payload });
      state.products[findIndex] = payload;
    },
    saveProductsDetailsAction: (state, { payload }) => {
      state.productsDetails = payload;
    },
    addProductDetailsAction: (state, { payload }) => {
      state?.productsDetails?.unshift(payload);
    },
    editProductDetailsAction: (state, { payload }) => {
      const findIndex = state.productsDetails.findIndex(
        (item: productProps) => item.productID === payload.productID
      );
      state.products[findIndex] = payload;
    },
  },
});

export const {
  saveStockAction,
  saveProductsAction,
  addProductAction,
  editProductAction,
  editProductDetailsAction,
  addProductDetailsAction,
  saveProductsDetailsAction,
  editStockAction,
} = stock.actions;

export default stock.reducer;
