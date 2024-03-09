import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { addSupplierAction, editSupplierAction } from "../../redux/suppliers";
import { SUPPLIERS } from "../../utils/endpoints";
import { supplierProps } from "../../utils/types";
import { CustomButton, CustomDialog, CustomInput } from "../common";
import { apiResponseStatus } from "../../utils/enums";

type AddFarmProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: supplierProps) => void;
  onShowClick?: () => void;
};

const AddFarm = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  onShowClick,
}: AddFarmProps) => {
  const { post, put } = useApi();
  const { t } = useTranslation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState(editData?.name ? editData?.name : "");
  const handleOnCloseAddProduct = () =>
    onClose ? onClose() : setShowAddProduct(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setName(editData?.name ? editData?.name : "");
  }, [editData, show]);

  const callAPI = () => {
    if (name) {
      if (editData) {
        put({
          url: SUPPLIERS.update,
          data: { name },
          params: { id: editData.id },
        }).then((res) => {
          console.log("Update Supplier: ", res);
          if (res.responseID === apiResponseStatus.success) {
            toast.success(" تم التعديل بنجاح ");
            setEditData && setEditData(res.responseValue);
            dispatch(editSupplierAction(res.responseValue));
          }
        });
      } else {
        post({ url: SUPPLIERS.add, data: { name } }).then((res) => {
          console.log("Get Supplier: ", res);
          if (res.responseID === apiResponseStatus.success) {
            toast.success(" تم الحفظ بنجاح ");
            dispatch(addSupplierAction(res.responseValue));
          }
        });

        setName("");
      }
      handleOnCloseAddProduct();
    } else
      toast.error("قم بملأ هذا العنصر اولا" + ", " + t("AddFarm.farmName"));
  };

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
              {t("AddFarm.addSupplier")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {editData ? t("AddFarm.editFarm") : t("AddFarm.addFarm")}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            autoFocus
            margin="dense"
            id="name"
            label={t("AddFarm.farmName")}
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

export default AddFarm;
