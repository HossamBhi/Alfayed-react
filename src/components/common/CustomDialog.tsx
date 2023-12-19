import { Dialog, DialogProps, DialogTitle } from "@mui/material";

interface CustomDialogProps {}

const CustomDialog = ({
  onClose,
  open,
  children,
}: CustomDialogProps & DialogProps) => {
  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      {children}
    </Dialog>
  );
};

export default CustomDialog;
