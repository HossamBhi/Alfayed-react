import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { addFridgeAction, editFridgeAction } from "../../redux/fridges";
import { FRIDGES } from "../../utils/endpoints";
import { apiResponseStatus } from "../../utils/enums";
import { supplierProps } from "../../utils/types";
import { CustomButton, CustomDialog, CustomInput } from "../common";

type AddFridgeProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: supplierProps) => void;
  onShowClick?: () => void;
};

const AddFridge = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  onShowClick,
}: AddFridgeProps) => {
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
          url: FRIDGES.update,
          data: { name },
          params: { id: editData.id },
        }).then((res) => {
          console.log("Update FRIDGES: ", res);
          if (res.responseID === apiResponseStatus.success) {
            toast.success(" تم التعديل بنجاح ");
            setEditData && setEditData(res.responseValue);
            dispatch(editFridgeAction(res.responseValue));
          }
        });
      } else {
        post({ url: FRIDGES.add, data: { name } }).then((res) => {
          console.log("Get FRIDGES:  ", res);
          if (res.responseID === apiResponseStatus.success) {
            toast.success(" تم الحفظ بنجاح ");
            dispatch(addFridgeAction(res.responseValue));
          }
        });

        setName("");
      }
      handleOnCloseAddProduct();
    } else {
      toast.error("قم بملأ هذا العنصر اولا" + ", " + t("fridges.name"));
    }
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
              <BsFillPlusCircleFill className="me-4" /> {t("fridges.addTitle")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {editData ? t("fridges.editTitle") : t("fridges.addTitle")}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            autoFocus
            margin="dense"
            id="name"
            label={t("fridges.name")}
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

export default AddFridge;
