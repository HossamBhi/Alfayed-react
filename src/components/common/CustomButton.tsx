import { Button, ButtonProps } from "@mui/material";

interface CustomButtonProps {}

const CustomButton = ({
  children,
  ...props
}: CustomButtonProps & ButtonProps) => {
  return <Button {...props}>{children}</Button>;
};

export default CustomButton;
