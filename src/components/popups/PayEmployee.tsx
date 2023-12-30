import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { EMPLOYEES } from "../../utils/endpoints";
import { employeeProps } from "../../utils/types";
import { CustomButton, CustomDialog, CustomInput } from "../common";

type PayEmployeeProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: employeeProps | null) => void;
  onShowClick?: () => void;
};

const PayEmployee = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  onShowClick,
}: PayEmployeeProps) => {
  const { post } = useApi();
  const { t } = useTranslation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [notes, setNotes] = useState("");
  const [total, setTotal] = useState(0);
  const handleOnCloseAddProduct = () =>
    onClose ? onClose() : setShowAddProduct(false);
  useEffect(() => {
    setNotes("");
    setTotal(0);
  }, [show]);
  const callAPI = () => {
    post({
      url: EMPLOYEES.pay,
      data: {
        id: editData.id,
        total,
        trasactionTypeID: 2,
        notes,
      },
      params: { id: editData.id },
    }).then((res) => {
      console.log("Pay Employee: ", res);
      if (res?.id) {
        setEditData && setEditData(null);
        // dispatch(editEmployeeAction(res));
      }
    });
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
              {t("PayEmployee.addTitle")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>{t("PayEmployee.addTitle")}</DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            autoFocus
            margin="dense"
            id="total"
            label={t("PayEmployee.totalPay")}
            type="number"
            fullWidth
            value={total}
            onChange={({ target }) => setTotal(Number(target.value))}
          />
          <CustomInput
            autoFocus
            margin="dense"
            id="notes"
            label={t("PayEmployee.notes")}
            type="text"
            fullWidth
            value={notes}
            onChange={({ target }) => setNotes(target.value)}
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
            {t("common.save")}
          </CustomButton>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default PayEmployee;
