import WarningIcon from "@mui/icons-material/Warning";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as React from "react";
import Box from "@mui/joy/Box";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

interface ErrorProps {
  message: string;
}

export default function AlertError(props: ErrorProps) {
  const [display, setDisplay] = React.useState(true);

  return (
    <Box display="flex" gap={2} width="100%" flexDirection="column">
      {display && (
        <Alert
          key="Error"
          sx={{ alignItems: "flex-start" }}
          startDecorator={<WarningIcon />}
          variant="soft"
          color="danger"
          endDecorator={
            <IconButton variant="soft" color="danger" onClick={() => setDisplay(false)}>
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          <div>
            <div>Error</div>
            <Typography level="body-sm">{props.message}</Typography>
          </div>
        </Alert>
      )}
    </Box>
  );
}
