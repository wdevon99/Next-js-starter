"use client";

import { useEffect, useState } from "react";
import { signIn, getProviders, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card } from "antd";
import SkeletonButton from "antd/es/skeleton/Button";
import AuthButton from "@components/atoms/AuthButton";
import styles from './styles.module.sass';

function AuthCard() {
  const CARD_WIDTH = 678;

  const { data: session } = useSession();
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    initProviders();
  }, []);

  const initProviders = async () => {
    setIsLoading(true);
    const res: any = await getProviders();

    setProviders(res);
    setTimeout(() => setIsLoading(false), 1000);
  }

  if (session) {
    return (
      <Card style={{ width: CARD_WIDTH }} >
        <div className={styles.container}>
          <p className={styles.label}>You are signed in as <b>{session?.user?.name}</b>.</p>
          <Button
            type="primary"
            className={styles.button}
            onClick={() => router.push('/dashboard')}
            block
          >
            Go to Dashboard
          </Button>
          <Button
            className={styles.button}
            type="dashed"
            onClick={() => signOut()}
            block
            danger
          >
            Log out
          </Button>
        </div>
      </Card >
    );
  }


  if (isLoading) {
    return (
      <Card style={{ width: CARD_WIDTH }} >
        <div className={styles.container}>
          <SkeletonButton active={true} block={true} style={{ marginBottom: 10, marginTop: 10, height: 42 }} />
          <SkeletonButton active={true} block={true} style={{ marginBottom: 10, height: 42 }} />
        </div>
      </Card>
    )
  }

  return (
    <Card style={{ width: CARD_WIDTH }} >
      <div className={styles.container}>
        {providers &&
          Object.values(providers).map((provider: any) => (
            <AuthButton
              key={provider?.name}
              providername={provider?.name}
              text={`Continue with ${provider.name}`}
              onClick={() => { signIn(provider.id, { callbackUrl: '/dashboard' }); }}
            />
          ))}
      </div>
    </Card>
  )
}

export default AuthCard