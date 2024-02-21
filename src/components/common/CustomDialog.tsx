import { Dialog, DialogProps, DialogTitle } from "@mui/material";

interface CustomDialogProps {}

const CustomDialog = ({
  onClose,
  open,
  children,
  ...props
}: CustomDialogProps & DialogProps) => {
  return (
    <Dialog fullWidth onClose={onClose} open={open} {...props}>
      {children}
    </Dialog>
  );
};

export default CustomDialog;
