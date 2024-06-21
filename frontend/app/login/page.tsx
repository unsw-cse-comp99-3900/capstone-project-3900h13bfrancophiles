'use client'

import { login } from '@/api';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const onLogin = async () => {
    try {
      const { token } = await login("z1234567", "z1234567");
      setCookie("token", token, { maxAge: 60 * 60 * 24 });
    } catch (e: any) {
      console.error("Login failed " + e);
    }
    router.push('/');
  }

  return (
    <button onClick={onLogin}>Login</button>
  )
}