'use client';

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const AuthSessionProvider = ({ children, session }: Props) => (
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
)

type Props = {
  children: React.ReactNode,
  session: Session | null
}

export default AuthSessionProvider;
