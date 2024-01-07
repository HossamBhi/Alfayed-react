import { LinearProgress } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader, SideMenu } from "../components";
import { useApi } from "../hooks";
import { saveClientsAction } from "../redux/clients";
import { saveExpensesAction } from "../redux/expenses";
import { saveFridgesAction } from "../redux/fridges";
import { saveProductsAction, saveProductsDetailsAction } from "../redux/stock";
import { RootState } from "../redux/store";
import { saveSuppliersAction } from "../redux/suppliers";
import {
  ACCOUNTS,
  CLIENT,
  EXPENSES,
  FRIDGES,
  PRODUCTS,
  SUPPLIERS,
} from "../utils/endpoints";
import { saveTotalAction, saveTransactionsAction } from "../redux/accounts";
import { getTrasactionsEnums } from "../utils/enums";

const PagesLayout = ({ children }: { children: ReactNode }) => {
  const { isLoad } = useSelector((state: RootState) => state.appSettings);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const { get, post } = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Call me i am all apis statics");
    get({ url: SUPPLIERS.getAll }).then((res) => {
      // console.log("SUPPLIERS.getAll: ", { res });
      if (Array.isArray(res)) {
        dispatch(saveSuppliersAction(res));
      }
    });
    get({ url: FRIDGES.getAll }).then((res) => {
      console.log("FRIDGES.getAll : ", { res });
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
        dispatch(saveTotalAction(res));
      }
    });
    post({
      url: ACCOUNTS.getAll,
      params: { recordType: getTrasactionsEnums.all },
    }).then((res) => {
      console.log("ACCOUNTS.getAll: ", { res });
      if (Array.isArray(res)) {
        dispatch(saveTransactionsAction(res));
      }
    });
  }, []);

  return (
    <div className="bg-background w-full">
      <div className="flex">
        <SideMenu isShowMenu={isShowMenu} setIsShowMenu={setIsShowMenu} />
        <div className={`w-full bg-background relative`}>
          {isLoad && (
            <div className="w-full rounded fixed top-0 z-10">
              <LinearProgress className="rounded" />
            </div>
          )}

          <PageHeader {...{ isShowMenu, setIsShowMenu }} />
          {children}
        </div>
      </div>
      {/* {children} */}
    </div>
  );
};

export default PagesLayout;
