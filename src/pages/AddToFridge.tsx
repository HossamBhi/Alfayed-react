import { Autocomplete, CircularProgress, FormControl } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomButton, CustomInput, CustomSelect } from "../components/common";
import { AddFridge, AddPropduct } from "../components/popups";
import { useApi } from "../hooks";
import usePathname from "../hooks/usePathname";
import { RootState } from "../redux/store";
import { FRIDGE_TRANSACTION_TYPES } from "../utils/appDB";
import { FRIDGES } from "../utils/endpoints";
import { fridgeTransactionEnums } from "../utils/enums";
import { formatDate } from "../utils/helper";
import { productProps, supplierProps } from "../utils/types";

const AddToFridge = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [isLoad, setIsLoad] = useState(false);
  const fridges = useSelector((state: RootState) => state.fridges.fridges);
  const { t } = useTranslation();
  const products = useSelector((state: RootState) => state.stock.products);

  const { post, put } = useApi();
  const [values, setValues] = useState({
    fridgeID: 0,
    fridgeName: "",
    productName: "",
    productID: "",
    number: "",
    action: fridgeTransactionEnums.in,
    supplyDate: formatDate(new Date()),
    quantity: "",
    total: "",
    price: "",
    payed: "",
    typeId: "",
    notes: "",
    carNumber: "",
  });
  // console.log(new Date("2023-12-04T00:00:00"));

  const [errors, setErrors] = useState({
    farmsName: false,
    fridgeID: false,
    carNumber: false,
    productID: false,
    number: false,
    quantity: false,
    discount: false,
    netQuantity: false,
    price: false,
    paied: false,
    remaining: false,
    farmsNotes: false,
    total: false,
    supplyDate: false,
    fridgeName: false,
    productName: false,
  });
  // console.log(values);
  const dispatch = useDispatch();
  const { get } = useApi();

  useEffect(() => {
    if (id != null) {
      get({ url: FRIDGES.getRecord, params: { recordId: id } }).then((res) => {
        console.log("FRIDGES.getRecord: ", { res });

        if (res?.fridgeID) {
          setValues({ ...values, ...res });
        }
      });
    }
    // get({ url: SUPPLIERS.getAll }).then((res) => {
    //   console.log("SUPPLIERS.getAll: ", { res });
    //   if (Array.isArray(res)) {
    //     // setSuppliers(res);
    //     dispatch(saveSuppliersAction(res));
    //   } else {
    //     // alert("Error: get fridges");
    //     // setSuppliers([]);
    //     // if (!fridges) {
    //     //   dispatch(saveSuppliersAction([]));
    //     // }
    //   }
    // });
    // get({ url: PRODUCTS.getAll }).then((res) => {
    //   console.log("PRODUCTS.getAll: ", { res });
    //   if (Array.isArray(res)) {
    //     setProducts(res);
    //   } else {
    //     alert("Error: get Products");
    //     setProducts([]);

    //   }
    // });
  }, [id]);

  const handleChangeValue = useCallback((e: any) => {
    const { id, value } = e.target;
    setValues((values) => ({ ...values, [id]: value }));
  }, []);
  const handleSelectChange = (
    name: string,
    value: null | (productProps & supplierProps)
  ) => {
    setValues((values) => ({
      ...values,
      [name + "ID"]: value?.id || "",
      [name + "Name"]: value?.name || "",
    }));

    setErrors((v) => ({
      ...v,
      [name + "ID"]: value?.id ? false : true,
    }));
  };

  const isValid = () => {
    let isTrue = true;
    if (!values.fridgeID) {
      setErrors((v) => ({ ...v, fridgeID: true }));
      isTrue = false;
    } else {
      setErrors((v) => ({ ...v, fridgeID: false }));
    }
    if (!values.productID) {
      setErrors((v) => ({ ...v, productID: true }));
      isTrue = false;
    } else {
      setErrors((v) => ({ ...v, productID: false }));
    }

    return isTrue;
  };
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const handleSubmit = () => {
    if (isValid()) {
      setIsLoad(true);
      if (id) {
        put({
          url: FRIDGES.updateRecord,
          params: { recordId: id },
          data: {
            ...values,
          },
        }).then((res) => {
          console.log("FRIDGES.addRecord: ", { res });
          if (res.farmRecordID) {
            navigate(
              pathname + "?" + createQueryString("id", res.farmRecordID)
            );
          }
          setIsLoad(false);
        });
      } else
        post({
          url: FRIDGES.addRecord,
          data: {
            ...values,
          },
        }).then((res) => {
          console.log("FRIDGES.addRecord: ", { res });
          if (res.farmRecordID) {
            navigate(
              pathname + "?" + createQueryString("id", res.farmRecordID)
            );
          }
          setIsLoad(false);
        });
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="mb-4 flex flex-col rounded-lg border bg-white p-4">
        {/* <h4 className="col-span-1 mb-4">
          {id ? t("fridges.editProduct") : t("fridges.addProduct")}
        </h4> */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-md border ltr:pr-1 rtl:pl-1 md:col-span-3">
            <Autocomplete
              className="flex-1"
              clearOnEscape
              options={fridges || []}
              getOptionLabel={(item) => item.name}
              id="fridge"
              onChange={(e, value) => {
                handleSelectChange("fridge", value);
              }}
              value={{ id: values.fridgeID, name: values.fridgeName } as any}
              renderInput={(params) => (
                <CustomInput
                  {...params}
                  error={errors.fridgeID}
                  id="fridge"
                  label={t("fridges.name")}
                />
              )}
            />
            <AddFridge showButtonTitle />
          </div>
          <div className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-md border ltr:pr-1 rtl:pl-1 md:col-span-2">
            <Autocomplete
              className="flex-1"
              clearOnEscape
              options={products || []}
              getOptionLabel={(item) => item.name}
              id="product"
              onChange={(e, value) => {
                handleSelectChange("product", value as any);
              }}
              value={
                {
                  id: values.productID,
                  name: values.productName,
                } as any
              }
              renderInput={(params) => (
                <CustomInput
                  {...params}
                  error={errors.productID}
                  id="product"
                  label={t("fridges.product")}
                />
              )}
            />
            <AddPropduct showButtonTitle />
          </div>
          <FormControl>
            <CustomInput
              id="supplyDate"
              label={t("fridges.date")}
              value={values.supplyDate}
              onChange={handleChangeValue}
              type="date"
            />
          </FormControl>
          <FormControl>
            <CustomSelect
              items={FRIDGE_TRANSACTION_TYPES()}
              id="actionType"
              label={t("fridges.actionType")}
              value={
                values.action
                  ? FRIDGE_TRANSACTION_TYPES()[0].id
                  : FRIDGE_TRANSACTION_TYPES()[1].id
              }
              onChange={(e, item) => {
                const { value } = e.target;
                setValues((values) => ({
                  ...values,
                  action:
                    value === 1
                      ? fridgeTransactionEnums.in
                      : fridgeTransactionEnums.out,
                }));
              }}
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="number"
              label={t("fridges.number")}
              value={values.number}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="quantity"
              label={t("fridges.quantity")}
              value={values.quantity}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>

          {/* <FormControl>
            <CustomInput
              id="discount"
              label={t("fridges.discount")}
              value={values.discount}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl> */}

          <FormControl>
            <CustomInput
              id="price"
              label={t("fridges.price")}
              value={values.price}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="total"
              label={t("fridges.total")}
              value={values.total}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="payed"
              label={t("fridges.payed")}
              value={values.payed}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl>
            <CustomInput
              type="text"
              id="carNumber"
              label={t("fridges.carNumber")}
              value={values.carNumber}
              onChange={handleChangeValue}
            />
          </FormControl>
          <FormControl className={`col-span-1 md:col-span-2`}>
            <CustomInput
              id="notes"
              label={t("fridges.notes")}
              value={values.notes}
              onChange={handleChangeValue}
              type="text"
            />
          </FormControl>
          <FormControl className={`col-span-1 md:col-span-2`}></FormControl>
          {isLoad ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <CustomButton
                variant="contained"
                color={id ? "secondary" : "primary"}
                onClick={handleSubmit}
              >
                {id ? t("common.edit") : t("common.save")}
              </CustomButton>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default AddToFridge;
