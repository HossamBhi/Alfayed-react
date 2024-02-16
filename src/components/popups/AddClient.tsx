import { useApi } from "../../hooks";
import { clientProps } from "../../utils/types";
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PopupButton } from ".";
import { CustomButton, CustomDialog, CustomInput } from "../common";
import { CLIENT } from "../../utils/endpoints";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addClientAction, editClientAction } from "../../redux/clients";
import { toast } from "react-toastify";

type AddClientProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: clientProps) => void;
  onShowClick?: () => void;
};

const AddClient = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  onShowClick,
}: AddClientProps) => {
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
        url: CLIENT.update,
        data: { name },
        params: { id: editData.id },
      }).then((res) => {
        console.log("Update Cleint: ", res);
        if (res?.id) {
          toast.success(" تم التعديل بنجاح ");
          setEditData && setEditData(res);
          dispatch(editClientAction(res));
        }
      });
    } else {
      post({ url: CLIENT.add, data: { name } }).then((res) => {
        console.log("Update Cleint: ", res);
        if (!res.status) {
          toast.success(" تم الحفظ بنجاح ");
          dispatch(addClientAction(res));
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
              <BsFillPlusCircleFill className="ltr:mr-4 rtl:ml-4" />{" "}
              {t("client.addClient")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {editData ? t("client.editClient") : t("client.addClient")}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            autoFocus
            margin="dense"
            id="name"
            label={t("client.clientName")}
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

export default AddClient;
