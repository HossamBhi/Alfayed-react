import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader, SideMenu } from "./components";
import { useApi } from "./hooks";
import usePathname from "./hooks/usePathname";
import { saveClientsAction } from "./redux/clients";
import { saveExpensesAction } from "./redux/expenses";
import { RootState } from "./redux/store";
import { saveSuppliersAction } from "./redux/suppliers";
import { CLIENT, EXPENSES, SUPPLIERS } from "./utils/endpoints";
import MainRoutes from "./routes";

const App = () => {
  // const { i18n } = useTranslation();
  // const { isLoad } = useSelector((state: RootState) => state.appSettings);
  // const [wait, setWait] = useState(true);
  // const pathname = usePathname();
  // const [isShowMenu, setIsShowMenu] = useState(false);
  // const { get } = useApi();
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   console.log("Call me iam all apis statics");
  //   get({ url: SUPPLIERS.getAll }).then((res) => {
  //     console.log("SUPPLIERS.getAll: ", { res });
  //     if (Array.isArray(res)) {
  //       dispatch(saveSuppliersAction(res));
  //     } else {
  //       dispatch(saveSuppliersAction([]));
  //     }
  //   });
  //   get({ url: EXPENSES.getAll }).then((res) => {
  //     console.log("EXPENSES.getAll: ", { res });
  //     if (Array.isArray(res)) {
  //       // setSuppliers(res);
  //       dispatch(saveExpensesAction(res));
  //     } else {
  //       // alert("Error: get suppliers");
  //       // setSuppliers([]);
  //       // if (!suppliers) {
  //       dispatch(saveExpensesAction([]));
  //       // }
  //     }
  //   });
  //   get({ url: CLIENT.getAll }).then((res) => {
  //     console.log("CLIENT.getAll: ", { res });
  //     if (Array.isArray(res)) {
  //       // setSuppliers(res);
  //       dispatch(saveClientsAction(res));
  //     } else {
  //       // alert("Error: get suppliers");
  //       // setSuppliers([]);
  //       // if (!suppliers) {
  //       dispatch(saveClientsAction([]));
  //       // }
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     // navigator.serviceWorker.register("/sw.js");
  //   }

  //   setTimeout(() => {
  //     setWait(false);
  //   }, 100);
  // }, []);

  return <MainRoutes />;

  // return (
  //   <>
  //     <div className="flex">
  //       <SideMenu isShowMenu={isShowMenu} setIsShowMenu={setIsShowMenu} />
  //       <div className={`w-full bg-background`}>
  //         {isLoad && (
  //           <div className="w-full rounded">
  //             <LinearProgress className="rounded" />
  //           </div>
  //         )}

  //         <PageHeader {...{ isShowMenu, setIsShowMenu }} />
  //         {/* {children} */}
  //       </div>
  //     </div>
  //   </>
  // );
};

export default App;
