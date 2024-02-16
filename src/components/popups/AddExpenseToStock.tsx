import { useApi } from "../../hooks";
import { EXPENSES } from "../../utils/endpoints";
import { expenseProps } from "../../utils/types";
import {
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { PopupButton } from ".";
import { CustomButton, CustomDialog } from "../common";
import { ExpenseForm } from "../stock";
import { trasactionsEnums } from "../../utils/enums";
import { toast } from "react-toastify";

type AddExpenseToStockProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: expenseProps) => void;
  farmId: null | number | string;
  setExpensesData: Dispatch<SetStateAction<null | expenseProps[]>>;
  expensesData: any;
  onShowPress?: () => void;
};

const AddExpenseToStock = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  farmId,
  setExpensesData,
  expensesData,
  onShowPress,
}: AddExpenseToStockProps) => {
  const { post, put } = useApi();
  const { t } = useTranslation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [values, setValues] = useState(
    editData
      ? editData
      : {
          farmRecordID: 0,
          expenseID: 0,
          expenseName: "",
          expenseDate: "2023-12-07T17:22:31.679Z",
          created_Date: "2023-12-07T17:22:31.679Z",
          quantity: 0,
          value: 0,
          price: 0,
          additionalPrice: 0,
          additionalNotes: "",
          total: 0,
          paied: 0,
          remaining: 0,
          expenseRecordNotes: "",
        }
  );
  useEffect(() => {
    if (editData) {
      setValues(editData);
    } else {
      setValues({
        farmRecordID: 0,
        expenseID: 0,
        expenseName: "",
        expenseDate: new Date(),
        created_Date: new Date(),
        quantity: 0,
        value: 0,
        price: 0,
        additionalPrice: 0,
        additionalNotes: "",
        total: 0,
        paied: 0,
        remaining: 0,
        expenseRecordNotes: "",
      });
    }
  }, [editData]);
  const [errors, setErrors] = useState({
    expenseID: false,
    // expenseDate: "2023-12-07T17:22:31.679Z",
    // created_Date: "2023-12-07T17:22:31.679Z",
    // quantity: 0,
    // value: 0,
    // price: 0,
    // additionalPrice: 0,
    // additionalNotes: "",
    // total: 0,
    // paied: 0,
    // remaining: 0,
  });
  const isValid = () => {
    let isTrue = true;
    if (!values.expenseID) {
      toast.error("قم باختيار المصروف");
      setErrors((v) => ({ ...v, expenseID: true }));
      isTrue = false;
    } else {
      setErrors((v) => ({ ...v, expenseID: false }));
    }

    return isTrue;
  };
  const handleOnCloseAddProduct = () =>
    onClose ? onClose() : setShowAddProduct(false);

  const callAPI = () => {
    if (editData) {
      put({
        url: EXPENSES.updateRecord,
        data: { ...values },
        params: { id: editData.expenseRecordID, typeId: trasactionsEnums.pay },
      })
        .then((res) => {
          console.log("EXPENSES.updateRecord: ", res);
          if (res?.expenseRecordID) {
            toast.success(" تم التعديل بنجاح ");
            setEditData && setEditData(res);
            setExpensesData(
              expensesData.map((item: any) =>
                item?.expenseRecordID === res?.expenseRecordID ? res : item
              )
            );
          }
        })
        .finally(() => setIsLoad(false));
    } else {
      post({
        url: EXPENSES.addRecord,
        data: { ...values, farmRecordID: farmId, typeId: trasactionsEnums.pay },
      })
        .then((res) => {
          console.log("EXPENSES.addRecord: ", res);
          if (!res.status) {
            toast.success(" تم الحفظ بنجاح ");
            setExpensesData([res, ...expensesData]);
          }
        })
        .finally(() => setIsLoad(false));
    }
  };
  const handleSubmit = () => {
    if (isValid()) {
      setIsLoad(true);
      callAPI();
      handleOnCloseAddProduct();
    }
  };

  return (
    <div>
      {!hideShowBtn && (
        <PopupButton
          onClick={() => {
            onShowPress && onShowPress();
            setShowAddProduct(true);
          }}
          disabled={!farmId}
        >
          {showButtonTitle && (
            <>
              <BsFillPlusCircleFill className="ltr:mr-4 rtl:ml-4" />{" "}
              {t("AddToStock.addExpenseOnProduct")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {editData ? t("expenses.editExpense") : t("expenses.addExpense")}
        </DialogTitle>
        <DialogContent sx={{ width: "100%", pt: 1 }} className="!pt-1">
          <ExpenseForm
            {...{ values, errors, setValues, setErrors, handleSubmit }}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleOnCloseAddProduct}>
            {t("common.close")}
          </CustomButton>
          {isLoad ? (
            <CircularProgress />
          ) : (
            <CustomButton variant="contained" onClick={handleSubmit}>
              {editData ? t("common.edit") : t("common.save")}
            </CustomButton>
          )}
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default AddExpenseToStock;
