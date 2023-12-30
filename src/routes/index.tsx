import { Route, Routes } from "react-router-dom";
import {
  Accounts,
  AddToStock,
  ClientDetails,
  Clients,
  EmployeeDetails,
  Employees,
  Expenses,
  ExpensesDetails,
  FarmDetails,
  Home,
  PagesLayout,
  Products,
  Stock,
  Suppliers,
} from "../pages";

// export const PAGES = [
//   {
//     path: "/",
//     element: <Home />,
//     name: "الشاشة الرئيسية",
//     // ActiveIcon: AiFillHome,
//     // InactiveIcon: AiOutlineHome,
//   },
//   // {
//   //   path: "/add-template",
//   //   element: <AddTemplate />,
//   //   name: "إضافة قالب",
//   //   ActiveIcon: AiFillPlusCircle,
//   //   InactiveIcon: AiOutlinePlusCircle,
//   // },
// ];

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
