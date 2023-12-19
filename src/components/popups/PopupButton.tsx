import React from "react";
import { CustomButton } from "../common";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { ButtonProps } from "@mui/material";

const PopupButton = ({ onClick, children, ...props }: ButtonProps) => {
  return (
    <CustomButton
      sx={{ minWidth: "auto" }}
      variant="contained"
      onClick={onClick}
      {...props}
    >
      {children ? children : <BsFillPlusCircleFill />}
    </CustomButton>
  );
};

export default PopupButton;
