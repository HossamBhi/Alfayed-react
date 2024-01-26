import { LinearProgress } from "@mui/material";
import { ReactNode, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageHeader, SideMenu } from "../components";
import { useApi } from "../hooks";
import usePathname from "../hooks/usePathname";
import { saveTotalAction, saveTransactionsAction } from "../redux/accounts";
import { saveClientsAction } from "../redux/clients";
import { saveExpensesAction } from "../redux/expenses";
import { saveFridgesAction } from "../redux/fridges";
import {
  saveProductsAction,
  saveProductsDetailsAction,
  saveStockAction,
} from "../redux/stock";
import { RootState } from "../redux/store";
import { saveSuppliersAction } from "../redux/suppliers";
import {
  ACCOUNTS,
  CLIENT,
  EXPENSES,
  FRIDGES,
  PRODUCTS,
  STORE,
  SUPPLIERS,
} from "../utils/endpoints";
import { getTrasactionsEnums } from "../utils/enums";

const PagesLayout = ({ children }: { children: ReactNode }) => {
  const { isLoad } = useSelector((state: RootState) => state.appSettings);
  const logedUser = useSelector((state: RootState) => state.user);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const { get, post } = useApi();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/login");
  // console.log({ pathname, isLoginPage });
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (logedUser) {
      get({ url: SUPPLIERS.getAll }).then((res) => {
        // console.log("SUPPLIERS.getAll: ", { res });
        if (Array.isArray(res)) {
          dispatch(saveSuppliersAction(res));
        }
      });
      get({ url: FRIDGES.getAll }).then((res) => {
        // console.log("FRIDGES.getAll : ", { res });
        if (Array.isArray(res)) {
          dispatch(saveFridgesAction(res));
        }
      });
      get({ url: EXPENSES.getAll }).then((res) => {
        // console.log("EXPENSES.getAll: ", { res });
        if (Array.isArray(res)) {
          dispatch(saveExpensesAction(res));
        }
      });
      get({ url: CLIENT.getAll }).then((res) => {
        // console.log("CLIENT.getAll: ", { res });
        if (Array.isArray(res)) {
          dispatch(saveClientsAction(res));
        }
      });
      get({ url: PRODUCTS.getAll }).then((res) => {
        // console.log("PRODUCTS.getAll: ", { res });
        if (Array.isArray(res)) {
          dispatch(saveProductsAction(res));
        }
      });
      get({ url: PRODUCTS.getAllDetails }).then((res) => {
        // console.log("PRODUCTS.getAllDetails: ", { res });
        if (Array.isArray(res)) {
          dispatch(saveProductsDetailsAction(res));
        }
      });
      get({ url: ACCOUNTS.getTotal }).then((res) => {
        // console.log("ACCOUNTS.getTotal: ", { res });
        if (res.id) {
          dispatch(saveTotalAction(res.total));
        }
      });
      get({ url: STORE.getAll }).then((res) => {
        // console.log("STORE.getAll", { res });
        if (Array.isArray(res)) {
          dispatch(saveStockAction(res));
        }
      });
      post({
        url: ACCOUNTS.getAll,
        params: { recordType: getTrasactionsEnums.all },
      }).then((res) => {
        // console.log("ACCOUNTS.getAll: ", { res });
        if (Array.isArray(res?.responseValue)) {
          dispatch(saveTransactionsAction(res.responseValue));
        }
      });
    } else {
      navigate("/login");
    }
  }, [logedUser]);

  return (
    <div className="bg-background w-full">
      <div className="flex">
        {isLoginPage ? (
          <></>
        ) : (
          <SideMenu isShowMenu={isShowMenu} setIsShowMenu={setIsShowMenu} />
        )}
        <div className={`w-full bg-background relative`}>
          {isLoad && (
            <div className="w-full rounded fixed top-0 z-10">
              <LinearProgress className="rounded" />
            </div>
          )}

          {isLoginPage ? (
            <></>
          ) : (
            <PageHeader {...{ isShowMenu, setIsShowMenu }} />
          )}
          {children}
        </div>
      </div>
      {/* {children} */}
    </div>
  );
};

export default PagesLayout;
