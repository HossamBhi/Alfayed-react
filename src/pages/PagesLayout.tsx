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
import { apiResponseStatus, getTrasactionsEnums } from "../utils/enums";
import { convertArrayToKeyObject } from "../utils/helper";

const PagesLayout = ({ children }: { children: ReactNode }) => {
  const { isLoad } = useSelector((state: RootState) => state.appSettings);
  const logedUser = useSelector((state: RootState) => state.user);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const { get, post } = useApi();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/login");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (logedUser) {
      get({ url: SUPPLIERS.getAll }).then((res) => {
        // console.log("SUPPLIERS.getAll: ", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveSuppliersAction(convertArrayToKeyObject(res.responseValue, "id")));
        }
      });
      get({ url: FRIDGES.getAll }).then((res) => {
        // console.log("FRIDGES.getAll : ", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveFridgesAction(res.responseValue));
        }
      });
      get({ url: EXPENSES.getAll }).then((res) => {
        // console.log("EXPENSES.getAll: ", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveExpensesAction(res.responseValue));
        }
      });
      get({ url: CLIENT.getAll }).then((res) => {
        // console.log("CLIENT.getAll: ", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveClientsAction(res.responseValue));
        }
      });
      get({ url: PRODUCTS.getAll }).then((res) => {
        // console.log("PRODUCTS.getAll: ", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveProductsAction(res.responseValue));
        }
      });
      get({ url: PRODUCTS.getAllDetails }).then((res) => {
        // console.log("PRODUCTS.getAllDetails: ", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveProductsDetailsAction(res.responseValue));
        }
      });
      get({ url: ACCOUNTS.getTotal }).then((res) => {
        // console.log("ACCOUNTS.getTotal: ", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveTotalAction(res.responseValue.total));
        }
      });
      get({ url: STORE.getAll }).then((res) => {
        // console.log("STORE.getAll", { res });
        if (res.responseID === apiResponseStatus.success) {
          dispatch(saveStockAction(res.responseValue));
        }
      });
      post({
        url: ACCOUNTS.getAll,
        params: { recordType: getTrasactionsEnums.all },
      }).then((res) => {
        // console.log("ACCOUNTS.getAll: ", { res });
        if (
          res.responseID === apiResponseStatus.success &&
          Array.isArray(res?.responseValue)
        ) {
          dispatch(
            saveTransactionsAction(
              convertArrayToKeyObject(res.responseValue, "id")
            )
          );
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
