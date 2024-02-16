import { TextField, TextFieldProps } from "@mui/material";

const CustomInput = ({ inputProps, ...props }: TextFieldProps) => {
  return (
    <TextField
      variant="outlined"
      inputProps={{ ...inputProps, maxLength: 200 }}
      {...props}
    />
  );
};

export default CustomInput;
