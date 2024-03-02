'use client';

import { SessionProvider } from "next-auth/react";

const AuthSessionProvider = ({ children, session }: any) => (
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
)

export default AuthSessionProvider;
