"use client";
import useFirebase from "@/hooks/useFirebase";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { useState } from "react";

export default function LoginPage() {
  const { app } = useFirebase();
  const router = useRouter();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, new GoogleAuthProvider());
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        const form = new FormData();
        form.set("access_token", idToken);
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/login`,
          form,
          { withCredentials: true }
        );
        if (res.status === 200) {
          router.push("/admin");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <Button
        type="primary"
        icon={
          loading ? <Spin wrapperClassName="text-white" /> : <GoogleOutlined />
        }
        size="large"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-600 border-none rounded-md"
      >
        Sign in with Google
      </Button>
      <Button type="text" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </div>
  );
}
