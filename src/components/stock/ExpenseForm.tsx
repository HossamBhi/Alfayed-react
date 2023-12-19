import { Autocomplete, FormControl } from "@mui/material";
import { Dispatch, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CustomInput } from "../../components/common";
import { AddExpenses } from "../../components/popups";
import { RootState } from "../../redux/store";
import { productProps, supplierProps } from "../../utils/types";

interface ExpenseFormProps {
  values: {
    farmRecordID: 0;
    expenseID: 0;
    expenseName: "";
    expenseDate: "2023-12-07T17:22:31.679Z";
    created_Date: "2023-12-07T17:22:31.679Z";
    quantity: 0;
    value: 0;
    price: 0;
    additionalPrice: 0;
    additionalNotes: "";
    total: 0;
    paied: 0;
    remaining: 0;
    expenseRecordNotes: "";
  };
  errors: {
    expenseID: boolean;
  };
  setValues: Dispatch<any>;
  setErrors: Dispatch<any>;
  handleSubmit?: () => void;
}
const ExpenseForm = ({
  values,
  errors,
  setValues,
  setErrors,
  handleSubmit,
}: ExpenseFormProps) => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const { t } = useTranslation();

  const handleChangeValue = (e: any) => {
    const { id, value } = e.target;
    setValues({ ...values, [id]: value });
  };
  const handleSelectChange = (
    name: string,
    value: null | (productProps & supplierProps)
  ) => {
    setValues({
      ...values,
      [name + "ID"]: value?.id || "",
      [name + "Name"]: value?.name || "",
    });
    setErrors((v: any) => ({
      ...v,
      [name + "ID"]: value?.id ? false : true,
    }));
  };
  useEffect(() => {
    setValues((v: any) => ({ ...v, price: values.quantity * values.value }));
  }, [values.quantity, values.value]);

  useEffect(() => {
    setValues((v: any) => ({
      ...v,
      total: Number(values.price) + Number(values.additionalPrice),
    }));
  }, [values.additionalPrice, values.price]);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      <div className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-md border ltr:pr-1 rtl:pl-1 md:col-span-3">
        <Autocomplete
          className="flex-1"
          clearOnEscape
          options={expenses || []}
          getOptionLabel={(item) => item.name}
          id="expense"
          onChange={(e, value) => {
            handleSelectChange("expense", value);
          }}
          // value={suppliers?.find((item) => item.id == values.farmsID)}
          value={
            {
              id: values.expenseID,
              name: values.expenseName,
            } as any
          }
          // inputValue={values.expenseName || ""}
          renderInput={(params) => (
            <CustomInput
              {...params}
              error={errors.expenseID}
              id="expense"
              label={t("expenses.expensesName")}
            />
          )}
        />
        <AddExpenses showButtonTitle />
      </div>
      <FormControl>
        <CustomInput
          id="quantity"
          label={t("AddToStock.quantity")}
          value={values.quantity}
          onChange={handleChangeValue}
          type="number"
        />
      </FormControl>
      <FormControl>
        <CustomInput
          id="value"
          label={t("AddToStock.value")}
          value={values.value}
          onChange={handleChangeValue}
          type="number"
        />
      </FormControl>
      <FormControl>
        <CustomInput
          id="price"
          label={t("AddToStock.subTotal")}
          value={values.price}
          onChange={handleChangeValue}
          type="number"
          disabled
        />
      </FormControl>
      <FormControl>
        <CustomInput
          id="additionalPrice"
          label={t("AddToStock.additionalPrice")}
          value={values.additionalPrice}
          onChange={handleChangeValue}
          type="number"
        />
      </FormControl>
      <FormControl className="col-span-1 md:col-span-2">
        <CustomInput
          id="additionalNotes"
          label={t("AddToStock.additionalNotes")}
          value={values.additionalNotes}
          onChange={handleChangeValue}
          type="text"
        />
      </FormControl>
      <FormControl>
        <CustomInput
          id="total"
          label={t("AddToStock.total")}
          value={values.total}
          onChange={handleChangeValue}
          type="number"
          disabled
        />
      </FormControl>
      <FormControl>
        <CustomInput
          id="paied"
          label={t("AddToStock.payed")}
          value={values.paied}
          // value={values.paied || calculatePaied}
          onChange={handleChangeValue}
          type="number"
        />
      </FormControl>
      <FormControl>
        <CustomInput
          id="expenseDate"
          label={t("AddToStock.expenseDate")}
          value={values.expenseDate}
          onChange={handleChangeValue}
          type="date"
        />
      </FormControl>
      <FormControl className="col-span-1 md:col-span-3">
        <CustomInput
          id="expenseRecordNotes"
          label={t("AddToStock.note")}
          value={values.expenseRecordNotes}
          onChange={handleChangeValue}
          type="text"
        />
      </FormControl>
    </form>
  );
};

export default ExpenseForm;
