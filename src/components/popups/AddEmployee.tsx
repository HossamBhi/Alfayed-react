import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { PopupButton } from ".";
import { useApi } from "../../hooks";
import { addEmployeeAction, editEmployeeAction } from "../../redux/employees";
import { EMPLOYEES } from "../../utils/endpoints";
import { employeeProps } from "../../utils/types";
import { CustomButton, CustomDialog, CustomInput } from "../common";
import { toast } from "react-toastify";

type AddEmployeeProps = {
  onClose?: () => void;
  show?: boolean;
  hideShowBtn?: boolean;
  editData?: any;
  showButtonTitle?: boolean;
  setEditData?: (d: employeeProps | null) => void;
  onShowClick?: () => void;
};

const AddEmployee = ({
  onClose,
  show,
  hideShowBtn = false,
  editData,
  showButtonTitle,
  setEditData,
  onShowClick,
}: AddEmployeeProps) => {
  const { post, put } = useApi();
  const { t } = useTranslation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState(editData?.name ? editData?.name : "");
  const [salary, setSalary] = useState(
    editData?.salary ? editData?.salary : ""
  );
  const handleOnCloseAddProduct = () =>
    onClose ? onClose() : setShowAddProduct(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setName(editData?.name ? editData?.name : "");
    setSalary(editData?.salary ? editData?.salary : "");
  }, [editData]);

  const callAPI = () => {
    if (editData) {
      put({
        url: EMPLOYEES.update,
        data: { name, salary },
        params: { id: editData.id },
      }).then((res) => {
        console.log("Update Employee: ", res);
        if (res?.id) {
          toast.success(" تم التعديل بنجاح ");
          setEditData && setEditData(null);
          dispatch(editEmployeeAction(res));
        }
      });
    } else {
      post({ url: EMPLOYEES.add, data: { name, salary } }).then((res) => {
        console.log("Add Employees: ", res);
        if (!res.status) {
          toast.success(" تم الحفظ بنجاح ");
          dispatch(addEmployeeAction(res));
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
              {t("AddEmployee.addTitle")}
            </>
          )}
        </PopupButton>
      )}
      <CustomDialog
        open={show != undefined ? show : showAddProduct}
        onClose={handleOnCloseAddProduct}
      >
        <DialogTitle>
          {editData ? t("AddEmployee.editTitle") : t("AddEmployee.addTitle")}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <CustomInput
            autoFocus
            margin="dense"
            id="name"
            label={t("AddEmployee.name")}
            type="text"
            fullWidth
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <CustomInput
            autoFocus
            margin="dense"
            id="salary"
            label={t("AddEmployee.salary")}
            type="number"
            fullWidth
            value={salary}
            onChange={({ target }) => setSalary(target.value)}
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

export default AddEmployee;
