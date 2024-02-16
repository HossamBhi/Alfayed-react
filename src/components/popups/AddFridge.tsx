import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { addSupplierAction, editSupplierAction } from "../../redux/suppliers";
import { FRIDGES, SUPPLIERS } from "../../utils/endpoints";
import { supplierProps } from "../../utils/types";
import { CustomButton, CustomDialog, CustomInput } from "../common";
import { addFridgeAction, editFridgeAction } from "../../redux/fridges";
import { toast } from "react-toastify";

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
  }, [editData]);

  const callAPI = () => {
    if (editData) {
      put({
        url: FRIDGES.update,
        data: { name },
        params: { id: editData.id },
      }).then((res) => {
        console.log("Update FRIDGES: ", res);
        if (res?.id) {
          toast.success(" تم التعديل بنجاح ");
          setEditData && setEditData(res);
          dispatch(editFridgeAction(res));
        }
      });
    } else {
      post({ url: FRIDGES.add, data: { name } }).then((res) => {
        console.log("Get FRIDGES:  ", res);
        if (!res.status) {
          toast.success(" تم الحفظ بنجاح ");
          dispatch(addFridgeAction(res));
        }
      });

      setName("");
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
              <BsFillPlusCircleFill className="me-4" />{" "}
              {t("fridges.addTitle")}
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

export default AddFridge;
