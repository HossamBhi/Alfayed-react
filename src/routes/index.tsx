import { Route, Routes } from "react-router-dom";
import {
  AiFillHome,
  AiFillPlusCircle,
  AiOutlineHome,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { Home, PagesLayout } from "../pages";

export const PAGES = [
  {
    path: "/",
    element: <Home />,
    name: "الشاشة الرئيسية",
    ActiveIcon: AiFillHome,
    InactiveIcon: AiOutlineHome,
  },
  // {
  //   path: "/add-template",
  //   element: <AddTemplate />,
  //   name: "إضافة قالب",
  //   ActiveIcon: AiFillPlusCircle,
  //   InactiveIcon: AiOutlinePlusCircle,
  // },
];

const MainRoutes = () => (
  <PagesLayout>
    <Routes>
      {PAGES.map((item) => (
        <Route path={item.path} element={item.element} />
      ))}
    </Routes>
  </PagesLayout>
);

export default MainRoutes;
