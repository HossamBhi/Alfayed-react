import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { saveTotalAction } from "../../redux/accounts";
import { ACCOUNTS } from "../../utils/endpoints";
import { trasactionsEnums } from "../../utils/enums";
import { CustomButton, CustomDialog, CustomInput } from "../common";

type PayFormProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: any) => void;
  onShowClick?: () => void;
  type?: trasactionsEnums;
};

const SafeAddBalanceOrWithdraw = ({
  onClose,
  show,
  hideShowBtn = false,
  showButtonTitle,
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
  const handleOnClose = () => (onClose ? onClose() : setIsShow(false));
  useEffect(() => {
    setNotes("");
    setTotal("");
  }, [show]);

  // const setLocalData = (res: any) => {
  //   switch (type) {
  //     case profileEnums.suppliers:
  //       return dispatch(editSupplierAction(res));
  //     case profileEnums.expenses:
  //       return dispatch(editExpenseAction(res));
  //     case profileEnums.clients:
  //       return dispatch(editClientAction(res));
  //     case profileEnums.fridges:
  //       return dispatch(editFridgeAction(res));
  //     case profileEnums.employees:
  //       return dispatch(editEmployeeAction(res));
  //   }
  // };
  const handleOnSubmit = () => {
    if (!errors.total) {
      if (type === trasactionsEnums.income)
        post({
          url: ACCOUNTS.addBalance,
          data: { typeID: trasactionsEnums.income, balance: total, notes },
        }).then((res) => {
          console.log(`Post Pay ${type}: `, res);
          if (res?.id) {
            toast.success(" تم الحفظ بنجاح ");
            dispatch(saveTotalAction(res.total));
          }
        });
      else
        post({
          url: ACCOUNTS.withdraw,
          data: { total, notes },
        }).then((res) => {
          console.log(`Post withdraw ${type}: `, res);
          if (res?.id) {
            toast.success(" تم الحفظ بنجاح ");
            dispatch(saveTotalAction(res.total));
          }
        });
      handleOnClose();
    } else {
      toast.error("قم بملأ هذا العنصر اولا" + ", " + t("payForm.totalPay"));
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
        onClose={handleOnClose}
      >
        <DialogTitle>
          {type === trasactionsEnums.pay ? "اضافه مصروفات" : "اضافه الي الخزنه"}
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
          <CustomButton onClick={handleOnClose}>
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

export default SafeAddBalanceOrWithdraw;
