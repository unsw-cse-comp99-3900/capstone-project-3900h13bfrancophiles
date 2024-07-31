import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

interface ErrorModalProps {
  open: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ open, errorMessage, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRoundedIcon />
          Error
        </DialogTitle>
        <Divider />
        <DialogContent>{errorMessage}</DialogContent>
        <DialogActions>
          <Button variant="solid" color="primary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ErrorModal;
