import { Autocomplete, CircularProgress, FormControl } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomButton, CustomInput, CustomSelect } from "../components/common";
import { AddFarm, AddPropduct } from "../components/popups";
import { AddExpensesCard } from "../components/stock";
import { useApi } from "../hooks";
import usePathname from "../hooks/usePathname";
import { RootState } from "../redux/store";
import { saveSuppliersAction } from "../redux/suppliers";
import { DISCOUNT_TYPES } from "../utils/appDB";
import { FRIDGES, SUPPLIERS } from "../utils/endpoints";
import { formatDate } from "../utils/helper";
import { productProps, supplierProps } from "../utils/types";

const AddToFridge = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [isLoad, setIsLoad] = useState(false);
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const { t } = useTranslation();
  const products = useSelector((state: RootState) => state.stock.products);

  const { post, put } = useApi();
  const [values, setValues] = useState({
    farmsName: "",
    farmsID: 0,
    carNumber: "",
    // date: ,
    productName: "",
    productID: "",
    number: "",
    quantity: "",
    discount: 0,
    netQuantity: 0,
    price: 0,
    paied: 0,
    remaining: 0,
    farmsNotes: "",
    total: 0,
    supplyDate: formatDate(new Date()),
    created_Date: null,
    isPercentage: true,
  });
  // console.log(new Date("2023-12-04T00:00:00"));

  const [errors, setErrors] = useState({
    farmsName: false,
    farmsID: false,
    carNumber: false,
    // date: false,
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
  });
  // console.log(values);
  const dispatch = useDispatch();
  const { get } = useApi();

  useEffect(() => {
    // const searchQuiry = new URLSearchParams(window.location.search);
    // const ID = searchQuiry.get("id");
    if (id != null) {
      // setId(ID);
      get({ url: SUPPLIERS.getRecord, params: { recordId: id } }).then(
        (res) => {
          console.log("SUPPLIERS.getRecord: ", { res });

          if (res?.farmsID) {
            setValues({ ...values, ...res });
          }
        }
      );
    }
    get({ url: SUPPLIERS.getAll }).then((res) => {
      console.log("SUPPLIERS.getAll: ", { res });
      if (Array.isArray(res)) {
        // setSuppliers(res);
        dispatch(saveSuppliersAction(res));
      } else {
        // alert("Error: get suppliers");
        // setSuppliers([]);
        // if (!suppliers) {
        //   dispatch(saveSuppliersAction([]));
        // }
      }
    });
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
  const calculateNetQuantity: number = useMemo(() => {
    const { quantity, discount, isPercentage } = values;
    if (discount <= 0) return Number(quantity);
    if (isPercentage)
      return Number(
        (Number(quantity) * (1 - Number(discount / 100))).toFixed(2)
      );
    else return Number((Number(quantity) - discount).toFixed(2));
  }, [values.discount, values.quantity, values.isPercentage]);

  const calculateTotal = useMemo(() => {
    const { price } = values;

    return (price * (calculateNetQuantity || 1)).toFixed(2);
  }, [calculateNetQuantity, values.price]);
  const isValid = () => {
    let isTrue = true;
    if (!values.farmsID) {
      setErrors((v) => ({ ...v, farmsID: true }));
      isTrue = false;
    } else {
      setErrors((v) => ({ ...v, farmsID: false }));
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
            total: calculateTotal,
            netQuantity: calculateNetQuantity,
          },
        }).then((res) => {
          console.log("SUPPLIERS.addRecord: ", { res });
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
            total: calculateTotal,
            netQuantity: calculateNetQuantity,
          },
        }).then((res) => {
          console.log("SUPPLIERS.addRecord: ", { res });
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
        <h4 className="col-span-1 mb-4">
          {/* {id ? t("fridges.editProduct") : t("fridges.addProduct")} */}
          Comming soon!
        </h4>

        {/* <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-md border ltr:pr-1 rtl:pl-1 md:col-span-3">
            <Autocomplete
              className="flex-1"
              clearOnEscape
              options={suppliers || []}
              getOptionLabel={(item) => item.name}
              id="farms"
              onChange={(e, value) => {
                handleSelectChange("farms", value);
              }}
              value={{ id: values.farmsID, name: values.farmsName } as any}
              renderInput={(params) => (
                <CustomInput
                  {...params}
                  error={errors.farmsID}
                  id="farms"
                  label={t("fridges.name")}
                />
              )}
            />
            <AddFarm showButtonTitle />
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
            <CustomInput
              type="text"
              id="carNumber"
              label={t("fridges.carNumber")}
              value={values.carNumber}
              onChange={handleChangeValue}
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
          <FormControl>
            <CustomSelect
              items={DISCOUNT_TYPES()}
              id="discountType"
              label={t("fridges.discountType")}
              value={
                values.isPercentage
                  ? DISCOUNT_TYPES()[0].id
                  : DISCOUNT_TYPES()[1].id
              }
              onChange={(e, item) => {
                const { value } = e.target;
                setValues((values) => ({
                  ...values,
                  isPercentage: value === 1,
                }));
              }}
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="discount"
              label={t("fridges.discount")}
              value={values.discount}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>

          <FormControl>
            <CustomInput
              id="netQuantity"
              label={t("fridges.netQuantity")}
              value={calculateNetQuantity}
              onChange={handleChangeValue}
              type="number"
              disabled
            />
          </FormControl>
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
              value={values.total || calculateTotal}
              onChange={handleChangeValue}
              type="number"
              disabled
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="paied"
              label={t("fridges.payed")}
              value={values.paied}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl className={`col-span-1 md:col-span-2`}>
            <CustomInput
              id="farmsNotes"
              label={t("fridges.note")}
              value={values.farmsNotes}
              onChange={handleChangeValue}
              type="text"
            />
          </FormControl>
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
        </form> */}
      </div>
    </main>
  );
};

export default AddToFridge;
