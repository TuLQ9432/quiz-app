import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  CircularProgress,
} from "@mui/material";

interface WaitingDialogProps {
  text: string;
  isWaiting: boolean;
}

function WaitingDialog({ text, isWaiting }: WaitingDialogProps) {
  return (
    <Dialog open={isWaiting}>
      <DialogContent sx={{ textAlign: "center" }}>
        <CircularProgress sx={{ mb: 1 }} />
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default memo(WaitingDialog);
