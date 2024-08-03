"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  Alert,
  AspectRatio,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import Image from "next/image";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";

import { login } from "@/api";

export default function Login() {
  const router = useRouter();
  const [zid, setZid] = React.useState("");
  const [zpass, setZpass] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    setError(undefined);

    if (!zid) {
      setError("Error: zID required");
      setIsLoading(false);
      return;
    }
    if (!zpass) {
      setError("Error: Password required");
      setIsLoading(false);
      return;
    }

    try {
      const { token } = await login(zid, zpass);
      setCookie("token", token, { maxAge: 60 * 60 * 24 });
      router.push("/");
      router.refresh(); // reloads navbar
    } catch (e: unknown) {
      setError(`${e}`);
    }
    setIsLoading(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allows pressing enter to submit form
    if (e.key === "Enter") {
      setIsLoading(true);
      await onSubmit();
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" height="100%" spacing={4}>
      <AspectRatio
        variant="plain"
        ratio="10/3"
        sx={{ backgroundColor: "transparent", width: { xs: 300, sm: 380 } }}
      >
        <Image priority src="/roomallocfull.svg" alt="roomalloc logo" fill />
      </AspectRatio>
      <Sheet variant="outlined" sx={{ borderRadius: "md", boxShadow: "md" }}>
        <Stack spacing={2} p={3} width={{ xs: 300, sm: 380 }}>
          <Typography level="h1" textAlign="center">
            Sign In
          </Typography>
          {error && (
            <Alert
              size="md"
              color="danger"
              variant="soft"
              startDecorator={<WarningIcon />}
              endDecorator={
                <IconButton variant="soft" color="danger" onClick={() => setError(undefined)}>
                  <CloseRoundedIcon />
                </IconButton>
              }
            >
              <b>{error}</b>
            </Alert>
          )}
          <Stack spacing={1}>
            <FormControl>
              <FormLabel sx={{ fontSize: "md" }}>zID</FormLabel>
              <Input
                size="lg"
                sx={{ fontSize: "lg" }}
                value={zid}
                onChange={(e) => setZid(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ fontSize: "md" }}>zPass</FormLabel>
              <Input
                size="lg"
                sx={{ fontSize: "lg" }}
                value={zpass}
                onChange={(e) => setZpass(e.target.value)}
                onKeyDown={handleKeyDown}
                type="password"
              />
            </FormControl>
          </Stack>
          <Button size="lg" color="primary" loading={isLoading} onClick={onSubmit}>
            Sign In
          </Button>
        </Stack>
      </Sheet>
    </Stack>
  );
}
