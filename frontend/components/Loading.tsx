"use client";

import * as React from "react";
import { Box, CircularProgress, Stack } from "@mui/joy";

interface LoadingProps {
  page: string;
}

export default function Loading(props: LoadingProps) {
  return (
    <>
      <Stack spacing={2} marginTop="21.4px">
        <h1>{props.page}</h1>
        <Box alignSelf={"center"}>
          <CircularProgress />
        </Box>
      </Stack>
    </>
  );
}
