"use client";

import * as React from "react";
import { Box, Alert, Stack } from "@mui/joy";

interface ErrorProps {
  page: string;
  message: string;
}

export default function Error(props: ErrorProps) {
  return (
    <>
      <Stack spacing={2} marginTop="21.4px">
        <h1>{props.page}</h1>
        <Box alignSelf={"center"} width="100%">
          <Alert color="danger">{props.message}</Alert>
        </Box>
      </Stack>
    </>
  );
}
