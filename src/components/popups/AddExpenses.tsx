import { useApi } from "../../hooks";
import {
  addExpenseAction,
  editExpenseAction,
  saveExpensesTypesAction,
} from "../../redux/expenses";
import { RootState } from "../../redux/store";
import { EXPENSES, EXPENSES_TYPE } from "../../utils/endpoints";
import { expenseProps } from "../../utils/types";
import { isNotEmpty } from "../../utils/validation";
import {
  Autocomplete,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AddExpensesCategory, PopupButton } from ".";
import { CustomButton, CustomDialog, CustomInput } from "../common";
import { toast } from "react-toastify";

type AddExpensesProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  showButtonTitle?: boolean;
  editData?: any;
  setEditData?: (d: expenseProps) => void;
  onShowClick?: () => void;
};

const AddExpenses = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  onShowClick,
}: AddExpensesProps) => {
  const { expensesTypes } = useSelector((state: RootState) => state.expenses);
  const { post, put, get } = useApi();
  const { t } = useTranslation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState(editData?.name ? editData?.name : "");
  const [expenseType, setExpenseType] = useState(
    editData?.type ? editData?.type : ""
  );
  const [expenseTypeName, setExpenseTypeName] = useState(
    editData?.expenseTypeName ?? ""
  );
  const [errors, setErrors] = useState({ name: false, type: false });
  const dispatch = useDispatch();
  const handleOnCloseAddProduct = () => {
    onClose ? onClose() : setShowAddProduct(false);
  };

  useEffect(() => {
    setName(editData?.name ?? "");
    setExpenseType(editData?.type ?? "");
    setExpenseTypeName(editData?.expenseTypeName ?? "");
  }, [editData, show]);

  const callAPI = () => {
    if (!isNotEmpty(name)) {
      toast.error(
        "قم بملأ هذا العنصر اولا" + ", " + t("expenses.expensesName")
      );
      return setErrors({ ...errors, name: true });
    } else {
      setErrors({ ...errors, name: false });
    }
    if (!expenseType?.id) {
      toast.error(
        "قم بملأ هذا العنصر اولا" + ", " + t("expenses.expenseCategroy")
      );

      return setErrors({ ...errors, type: true });
    } else {
      setErrors({ ...errors, type: false });
    }
    if (editData) {
      put({
        url: EXPENSES.update,
        data: { name },
        params: { id: editData.id },
      }).then((res) => {
        console.log("Update EXPENSES: ", res);
        if (res?.id) {
          toast.success(" تم التعديل بنجاح ");
          setEditData && setEditData(res);
          dispatch(editExpenseAction(res));
        }
      });
    } else {
      post({
        url: EXPENSES.add,
        data: { name, expenseTypeId: expenseType?.id },
      }).then((res) => {
        console.log("get EXPENSES: ", res);
        if (res.status) {
          // alert("Error " + res.status + ": " + res.data);
        } else {
          toast.success(" تم الحفظ بنجاح ");
          dispatch(addExpenseAction(res));
        }
      });

      setName("");
    }
    handleOnCloseAddProduct();
  };

  useEffect(() => {
    get({ url: EXPENSES_TYPE.getAll }).then((res) => {
      console.log("EXPENSES_TYPE.getAll: ", { res });
      if (Array.isArray(res)) {
        dispatch(saveExpensesTypesAction(res));
      }
    });
  }, []);
  return (
    <div>
      {!hideShowBtn && (
        <PopupButton
          onClick={() =>
            onShowClick ? onShowClick() : setShowAddProduct(true)
          }
        >
          {showButtonTitle && (
            <>
              <BsFillPlusCircleFill className="ltr:mr-4 rtl:ml-4" />{" "}
              {t("expenses.addExpense")}
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
        <DialogContent sx={{ width: "100%" }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <CustomInput
              error={errors.name}
              autoFocus
              margin="dense"
              id="name"
              label={t("expenses.expensesName")}
              type="text"
              fullWidth
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </FormControl>

          <div className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-md border ltr:pr-1 rtl:pl-1 md:col-span-2">
            <Autocomplete
              className="flex-1"
              clearOnEscape
              options={expensesTypes}
              getOptionLabel={(item) => item.name}
              id="type"
              value={expensesTypes.find((item) => item.name == expenseTypeName)}
              onChange={(e, value) => {
                if (!value?.id) {
                  setErrors({ ...errors, type: true });
                } else {
                  setErrors({ ...errors, type: false });
                }
                setExpenseType(value);
              }}
              renderInput={(params) => (
                <CustomInput
                  {...params}
                  id="type"
                  label={t("expenses.expenseCategroy")}
                  error={errors.type}
                />
              )}
            />
            <AddExpensesCategory showButtonTitle />
          </div>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleOnCloseAddProduct}>
            {t("common.close")}
          </CustomButton>
          <CustomButton variant="contained" onClick={callAPI}>
            {editData ? t("common.edit") : t("common.save")}
          </CustomButton>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default AddExpenses;
