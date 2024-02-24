import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { addExpenseTypeAction } from "../../redux/expenses";
import { EXPENSES_TYPE } from "../../utils/endpoints";
import { expenseProps } from "../../utils/types";
import { isNotEmpty } from "../../utils/validation";
import { CustomButton, CustomDialog, CustomInput } from "../common";

type AddExpensesCategoryProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  showButtonTitle?: boolean;
  editData?: any;
  setEditData?: (d: expenseProps) => void;
};

const AddExpensesCategory = ({
  onClose,
  show,
  hideShowBtn = false,
  showButtonTitle,
  editData,
  setEditData,
}: AddExpensesCategoryProps) => {
  const { post, put } = useApi();
  const { t } = useTranslation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState(editData?.name ? editData?.name : "");
  const [errors, setErrors] = useState({ name: false });
  const handleOnCloseAddProduct = () =>
    onClose ? onClose() : setShowAddProduct(false);
  const dispatch = useDispatch();
  const callAPI = () => {
    if (!isNotEmpty(name)) {
      toast.error(
        "قم بملأ هذا العنصر اولا" + ", " + t("expenses.expensesCategoryName")
      );
      return setErrors({ ...errors, name: true });
    } else {
      setErrors({ ...errors, name: false });
    }
    if (editData) {
      put({
        url: EXPENSES_TYPE.update,
        data: { name },
        params: { id: editData.id },
      }).then((res) => {
        console.log("Update Supplier: ", res);
        if (res?.id) {
          toast.success(" تم التعديل بنجاح ");
          setEditData && setEditData(res);
        }
      });
    } else {
      post({ url: EXPENSES_TYPE.add, data: { expenseTypeName: name } }).then(
        (res) => {
          console.log("EXPENSES_TYPE Add:  ", res);
          if (res.status) {
            // alert("Error " + res.status + ": " + res.data);
          } else {
            toast.success(" تم الحفظ بنجاح ");
            dispatch(addExpenseTypeAction(res));
          }
        }
      );

      setName("");
    }
    handleOnCloseAddProduct();
  };

  return (
    <div>
      {!hideShowBtn && (
        <PopupButton onClick={() => setShowAddProduct(true)}>
          {showButtonTitle && (
            <>
              <BsFillPlusCircleFill className="ltr:mr-4 rtl:ml-4" />{" "}
              {t("expenses.addExpensesCategory")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {editData
            ? t("expenses.editExpensesCategory")
            : t("expenses.addExpensesCategory")}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            error={errors.name}
            autoFocus
            margin="dense"
            id="name"
            label={t("expenses.expensesCategoryName")}
            type="text"
            fullWidth
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleOnCloseAddProduct}>
            {t("common.close")}
          </CustomButton>
          <CustomButton onClick={callAPI}>
            {editData ? t("common.edit") : t("common.save")}
          </CustomButton>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default AddExpensesCategory;
