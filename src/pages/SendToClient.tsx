import { Autocomplete, CircularProgress, FormControl } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import CarProducts from "../components/client/CarProducts";
import { CustomButton, CustomInput } from "../components/common";
import { AddFarm } from "../components/popups";
import { useApi } from "../hooks";
import usePathname from "../hooks/usePathname";
import { RootState } from "../redux/store";
import { CLIENT } from "../utils/endpoints";
import { trasactionsEnums } from "../utils/enums";
import { formatDate } from "../utils/helper";
import {
  clientRowProps,
  productListProps,
  productProps,
  supplierProps,
} from "../utils/types";

const SendToClient = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [isLoad, setIsLoad] = useState(false);
  const clients = useSelector((state: RootState) => state.clients);
  const { t } = useTranslation();

  const { post, put } = useApi();
  const [values, setValues] = useState<clientRowProps>({
    clientID: searchParams.get("clientID") || 0,
    clientName: searchParams.get("clientName") || "",
    driverName: "",
    deliveredToDriver: 0,
    date: formatDate(new Date()),
    typeId: 0,
    total: 0,
    carCapacity: 0,
    payed: 0,
    notes: "",
    payDate: formatDate(new Date()),
    productList: [],
  });
  const [errors, setErrors] = useState({ clientID: false, productID: false });
  const { get } = useApi();

  useEffect(() => {
    if (id != null) {
      get({ url: CLIENT.getRecord, params: { recordId: id } }).then((res) => {
        console.log("CLIENT.getRecord: ", { res });

        if (res?.clientID) {
          setValues({
            ...values,
            ...res,
            payDate: formatDate(res.payDate),
            date: formatDate(res.date),
          });
        }
      });
    }
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

  const calculateNetQuantity: string = useMemo(() => {
    const { productList } = values;

    return productList
      .reduce((prev, curr) => {
        return prev + Number(curr.quantity);
      }, 0)
      .toFixed(2);
  }, [values.productList]);

  const calculateTotal = useMemo(() => {
    const { deliveredToDriver, productList } = values;

    return (
      Number(deliveredToDriver) +
      productList.reduce((prev, curr) => {
        return prev + Number(curr.total);
      }, 0)
    ).toFixed(2);
  }, [values.productList, values.deliveredToDriver]);

  const isValid = () => {
    let isTrue = true;
    if (!values.clientID) {
      setErrors((v) => ({ ...v, clientID: true }));
      isTrue = false;
    } else {
      setErrors((v) => ({ ...v, clientID: false }));
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
          url: CLIENT.updateRecord,
          params: { id },
          data: {
            ...values,
            total: calculateTotal,
            carCapacity: calculateNetQuantity,
            typeId: trasactionsEnums.income,
            payed: values.payed || 0,
            deliveredToDriver: values.deliveredToDriver || 0,
          },
        }).then((res) => {
          console.log("CLIENT.updateRecord: ", { res });
          if (res.id) {
            navigate(pathname + "?" + createQueryString("id", res.id));
          }
          setIsLoad(false);
        });
      } else
        post({
          url: CLIENT.addRecord,
          data: {
            ...values,
            total: calculateTotal,
            carCapacity: calculateNetQuantity,
            typeId: trasactionsEnums.income,
            payed: values.payed || 0,
            deliveredToDriver: values.deliveredToDriver || 0,
          },
        }).then((res) => {
          console.log("CLIENT.addRecord: ", {
            res,
            requestData: {
              ...values,
              total: calculateTotal,
              carCapacity: calculateNetQuantity,
              typeId: trasactionsEnums.income,
            },
          });
          if (res.id) {
            navigate(pathname + "?" + createQueryString("id", res.id));
          }
          setIsLoad(false);
        });
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="mb-4 flex flex-col rounded-lg border bg-white p-4">
        <h4 className="col-span-1 mb-4">
          {id ? t("client.editCar") : t("client.sendCar")}
        </h4>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-md border ltr:pr-1 rtl:pl-1 md:col-span-3">
            <Autocomplete
              className="flex-1"
              clearOnEscape
              options={clients || []}
              getOptionLabel={(item) => item.name}
              id="client"
              onChange={(e, value) => {
                handleSelectChange("client", value);
              }}
              value={{ id: values.clientID, name: values.clientName } as any}
              renderInput={(params) => (
                <CustomInput
                  {...params}
                  error={errors.clientID}
                  id="client"
                  label={t("client.name")}
                />
              )}
            />
            <AddFarm showButtonTitle />
          </div>
          <FormControl>
            <CustomInput
              id="date"
              label={t("client.date")}
              value={values.date}
              onChange={handleChangeValue}
              type="date"
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="payDate"
              label={t("client.payDate")}
              value={values.payDate}
              onChange={handleChangeValue}
              type="date"
            />
          </FormControl>

          <FormControl>
            <CustomInput
              type="text"
              id="driverName"
              label={t("client.driverName")}
              value={values.driverName}
              onChange={handleChangeValue}
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="deliveredToDriver"
              label={t("client.deliveredToDriver")}
              value={values.deliveredToDriver}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl>
            <CustomInput
              disabled
              id="carCapacity"
              label={t("client.carCapacity")}
              value={calculateNetQuantity}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="total"
              label={t("client.carTotal")}
              value={calculateTotal}
              onChange={handleChangeValue}
              type="number"
              disabled
            />
          </FormControl>
          <FormControl>
            <CustomInput
              id="payed"
              label={t("client.payed")}
              value={values.payed}
              onChange={handleChangeValue}
              type="number"
            />
          </FormControl>
          <FormControl className={`col-span-1 md:col-span-2`}>
            <CustomInput
              id="notes"
              label={t("client.note")}
              value={values.notes}
              onChange={handleChangeValue}
              type="text"
            />
          </FormControl>
          {/* <div className="col-span-2 md:flex hidden"></div> */}
          {isLoad ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <CustomButton
                variant="contained"
                color={
                  values.productList?.length < 1
                    ? ("action" as any)
                    : id
                    ? "secondary"
                    : "primary"
                }
                onClick={handleSubmit}
                disabled={values.productList?.length < 1}
              >
                {id ? t("common.edit") : t("common.save")}
              </CustomButton>
              {/* {id && (
                <CustomButton
                  variant="outlined"
                  onClick={() => {
                    router.back();
                  }}
                >
                  {t("common.close")}
                </CustomButton>
              )} */}
            </>
          )}
        </form>
      </div>
      <CarProducts
        productList={values.productList}
        setProductList={(list: productListProps) => {
          // console.log({ list, productList: values.productList });
          setValues((vals: any) => {
            return {
              ...vals,
              productList: list,
            };
            // if (vals.productList) {
            //   console.log("SAVE ME AS OLD LIST TOO");
            //   return {
            //     ...vals,
            //     productList: [
            //       ...vals.productList.filter((item) => item.id != list.id),
            //       list,
            //     ],
            //   };
            // } else {
            //   console.log("-------------------------");

            //   return {
            //     ...vals,
            //     productList: list,
            //   };
            // }
          });
        }}
      />
    </main>
  );
};

export default SendToClient;
