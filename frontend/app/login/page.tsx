'use client'

import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
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
  Typography
} from '@mui/joy';
import Image from 'next/image';
import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WarningIcon from '@mui/icons-material/Warning';

import { login } from '@/api';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string>();

  const onSubmit = async () => {
    if (!username) {
      setError("Error: Username required");
      return;
    }
    if (!password) {
      setError("Error: Password required");
      return;
    }

    try {
      const { token } = await login(username, password);
      setCookie("token", token, { maxAge: 60 * 60 * 24 });
      router.push('/');
    } catch (e: any) {
      setError(`${e}`);
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allows pressing enter to submit form
    if (e.key === 'Enter') {
      await onSubmit();
    }
  }

  return (
    <Stack justifyContent="center" alignItems="center" height="100vh">
      <AspectRatio ratio="10/3" sx={{ width: 380 }} >
        <Image src="/logoFull.svg" alt="roomalloc logo" fill />
      </AspectRatio>
      <Sheet
        sx={{
          width: 380,
          my: 4,
          py: 3,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'md',
          boxShadow: 'md',
        }}
        variant='outlined'
      >
        {error && (
          <Alert
            size="lg"
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
          <Typography level="h1" textAlign="center">Sign In</Typography>
          <Typography level="body-md">Sign in with your UNSW zID and zPass</Typography>
        </Stack>
        <Stack spacing={1}>
          <FormControl>
            <FormLabel sx={{ fontSize: 'md' }}>Username</FormLabel>
            <Input
              size="lg"
              sx={{ fontSize: 'lg' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ fontSize: 'md' }}>Password</FormLabel>
            <Input
              size="lg"
              sx={{ fontSize: 'lg' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              type="password"
            />
          </FormControl>
        </Stack>
        <Button size="lg" color="primary" onClick={onSubmit}>
          Sign In
        </Button>
      </Sheet>
    </Stack>
  )
}