'use client'

import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const onLogin = () => {
    setCookie("token", "here's my token", { maxAge: 60 * 60 * 24 });
    router.push('/dashboard');
  }

  return (
    <button onClick={onLogin}>Login</button>
  )
}