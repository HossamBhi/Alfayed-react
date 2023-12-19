import { TextField, TextFieldProps } from "@mui/material";

const CustomInput = ({ ...props }: TextFieldProps) => {
  return <TextField label="Outlined" variant="outlined" {...props} />;
};

export default CustomInput;
