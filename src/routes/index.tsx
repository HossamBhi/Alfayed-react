import { Route, Routes } from "react-router-dom";
import {
  Accounts,
  AddToFridge,
  AddToStock,
  ClientDetails,
  Clients,
  EmployeeDetails,
  Employees,
  Expenses,
  ExpensesDetails,
  FarmDetails,
  FridgeDetails,
  Fridges,
  Home,
  PagesLayout,
  Products,
  Stock,
  Suppliers,
} from "../pages";

export const ROUTES = [
  { title: "homepage", path: "/", Page: Home },
  {
    title: "products",
    path: "/products",
    Page: Products,
  },
  {
    title: "addToStock",
    path: "/add-to-stock",
    Page: AddToStock,
  },
  {
    title: "addToFridge",
    path: "/add-to-fridge",
    Page: AddToFridge,
  },
  {
    title: "farmsAndFarmers",
    path: "/suppliers",
    Page: Suppliers,
  },
  {
    title: "expenses",
    path: "/expenses",
    Page: Expenses,
  },
  {
    title: "clients",
    path: "/clients",
    Page: Clients,
  },
  {
    title: "stock",
    path: "/stock",
    Page: Stock,
  },
  {
    title: "accounts",
    path: "/accounts",
    Page: Accounts,
  },
  {
    title: "clientDetails",
    path: "/client-details",
    Page: ClientDetails,
  },
  {
    title: "supplierDetails",
    path: "/farm-details",
    Page: FarmDetails,
  },
  {
    title: "expensesDetails",
    path: "/expenses-details",
    Page: ExpensesDetails,
  },
  {
    title: "employees",
    path: "/employees",
    Page: Employees,
  },
  {
    title: "employeeDetails",
    path: "/employee-details",
    Page: EmployeeDetails,
  },
  {
    title: "fridges",
    path: "/fridges",
    Page: Fridges,
  },
  {
    title: "fridgeDetails",
    path: "/fridge-details",
    Page: FridgeDetails,
  },
];
const MainRoutes = () => (
  <PagesLayout>
    <Routes>
      {ROUTES.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  </PagesLayout>
);

export default MainRoutes;
