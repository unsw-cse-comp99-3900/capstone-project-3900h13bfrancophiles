import * as React from "react";
import Button from "@mui/joy/Button";
import Snackbar from "@mui/joy/Snackbar";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

interface ErrorSnackbarProps {
  errorMessage: string;
  open: boolean;
}
export default function ErrorSnackbar(body: ErrorSnackbarProps) {
  const [open, setOpen] = React.useState(body.open);
  const [left, setLeft] = React.useState<undefined | number>();
  const timer = React.useRef<undefined | number>();
  const duration = 5000;
  const countdown = () => {
    timer.current = window.setInterval(() => {
      setLeft((prev) => (prev === undefined ? prev : Math.max(0, prev - 100)));
    }, 100);
  };
  React.useEffect(() => {
    if (open && duration !== undefined && duration > 0) {
      setLeft(duration);
      countdown();
    } else {
      window.clearInterval(timer.current);
    }
  }, [open, duration]);
  const handlePause = () => {
    window.clearInterval(timer.current);
  };
  const handleResume = () => {
    countdown();
  };
  return (
    <Snackbar
      autoHideDuration={duration}
      resumeHideDuration={left}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
      onUnmount={() => setLeft(undefined)}
      open={open}
      variant="soft"
      color="danger"
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      startDecorator={<WarningRoundedIcon />}
      endDecorator={
        <Button onClick={() => setOpen(false)} size="sm" variant="soft" color="danger">
          Dismiss
        </Button>
      }
    >
      {body.errorMessage}
    </Snackbar>
  );
}
