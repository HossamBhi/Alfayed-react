import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { editClientAction } from "../../redux/clients";
import { editEmployeeAction } from "../../redux/employees";
import { editExpenseAction } from "../../redux/expenses";
import { editFridgeAction } from "../../redux/fridges";
import { editSupplierAction } from "../../redux/suppliers";
import {
  CLIENT,
  EMPLOYEES,
  EXPENSES,
  FRIDGES,
  SUPPLIERS,
} from "../../utils/endpoints";
import { profileEnums, trasactionsEnums } from "../../utils/enums";
import { CustomButton, CustomDialog, CustomInput } from "../common";

type PayFormProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: any) => void;
  onShowClick?: () => void;
  type?: profileEnums;
};

const PayForm = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  onShowClick,
  type,
}: PayFormProps) => {
  const { post } = useApi();
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [total, setTotal] = useState<number | string>("");
  const [errors, setErrors] = useState({ total: true, notes: false });
  const dispatch = useDispatch();
  const handleOnCloseAddProduct = () =>
    onClose ? onClose() : setIsShow(false);
  useEffect(() => {
    setNotes("");
    setTotal("");
  }, [show]);
  const getProparAPI = () => {
    switch (type) {
      case profileEnums.suppliers:
        return SUPPLIERS;
      case profileEnums.expenses:
        return EXPENSES;
      case profileEnums.clients:
        return CLIENT;
      case profileEnums.fridges:
        return FRIDGES;
      case profileEnums.employees:
        return EMPLOYEES;
      default:
        return EMPLOYEES;
    }
  };
  const setLocalData = (res: any) => {
    switch (type) {
      case profileEnums.suppliers:
        return dispatch(editSupplierAction(res));
      case profileEnums.expenses:
        return dispatch(editExpenseAction(res));
      case profileEnums.clients:
        return dispatch(editClientAction(res));
      case profileEnums.fridges:
        return dispatch(editFridgeAction(res));
      case profileEnums.employees:
        return dispatch(editEmployeeAction(res));
    }
  };
  const handleOnSubmit = () => {
    if (!errors.total) {
      post({
        url: getProparAPI().pay,
        data: {
          id: editData.id,
          trasactionTypeID:
            type === profileEnums.clients
              ? trasactionsEnums.income
              : trasactionsEnums.pay,
          total,
          notes,
        },
        params: { id: editData.id },
      }).then((res) => {
        console.log(`Post Pay ${type}: `, res);
        if (res?.id) {
          setEditData && setEditData(null);
          setLocalData(res);
        }
      });
      handleOnCloseAddProduct();
    }
  };
  
  return (
    <div>
      {!hideShowBtn && (
        <PopupButton
          onClick={() => (onShowClick ? onShowClick() : setIsShow(true))}
        >
          {showButtonTitle && (
            <>
              <BsFillPlusCircleFill className="me-4" /> {t("PayForm.addTitle")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : isShow}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {t("payForm.payTo")} {editData?.name}{" "}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            autoFocus
            margin="dense"
            id="total"
            label={t("payForm.totalPay")}
            type="number"
            fullWidth
            value={total}
            onChange={({ target }) => {
              const value = target.value;
              console.log({ len: value?.trim()?.length });
              setTotal(target.value);
              setErrors({ ...errors, total: value?.trim()?.length <= 0 });
            }}
            error={errors.total}
          />
          <CustomInput
            margin="dense"
            id="notes"
            label={t("payForm.notes")}
            type="text"
            fullWidth
            value={notes}
            onChange={({ target }) => setNotes(target.value)}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleOnCloseAddProduct}>
            {t("common.close")}
          </CustomButton>
          <CustomButton onClick={handleOnSubmit}>
            {t("common.save")}
          </CustomButton>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default PayForm;
