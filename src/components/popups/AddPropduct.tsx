import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { CustomButton, CustomDialog, CustomInput } from "../common";
import { PopupButton } from ".";
import { productProps } from "../../utils/types";
import { useApi } from "../../hooks";
import { PRODUCTS } from "../../utils/endpoints";
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";

type AddPropductProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: productProps) => void;
  setProducts?: (v: productProps[]) => void;
  products?: productProps[];
};

const AddPropduct = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  setProducts,
  products,
}: AddPropductProps) => {
  const { post, put } = useApi();
  const { t } = useTranslation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState(editData?.name ? editData?.name : "");
  const handleOnCloseAddProduct = () =>
    onClose ? onClose() : setShowAddProduct(false);

  const callAPI = () => {
    if (editData) {
      put({
        url: PRODUCTS.update,
        data: { name },
        params: { id: editData.id },
      }).then((res) => {
        console.log("Update PRODUCTS: ", res);
        if (res?.id) {
          setEditData && setEditData(res);
        }
      });
    } else {
      post({ url: PRODUCTS.add, data: { name } }).then((res) => {
        console.log("Add PRODUCTS: ", res);
        if (!res.status) {
          if (setProducts && products)
            setProducts && setProducts([res, ...products]);
        }
      });

      setName("");
    }
  };
  return (
    <div>
      {!hideShowBtn && (
        <PopupButton onClick={() => setShowAddProduct(true)}>
          {showButtonTitle && (
            <>
              <BsFillPlusCircleFill className="ltr:mr-4 rtl:ml-4" />{" "}
              {t("product.addPropduct")}
            </>
          )}
        </PopupButton>
      )}

      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {editData ? t("product.editPropduct") : t("product.addPropduct")}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            autoFocus
            margin="dense"
            id="name"
            label={t("product.productName")}
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
          <CustomButton
            onClick={() => {
              callAPI();
              handleOnCloseAddProduct();
            }}
          >
            {editData ? t("common.edit") : t("common.save")}
          </CustomButton>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default AddPropduct;
