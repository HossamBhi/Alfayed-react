import { TextField, TextFieldProps } from "@mui/material";

const CustomInput = ({ ...props }: TextFieldProps) => {
  return <TextField  variant="outlined" {...props} />;
};

export default CustomInput;
