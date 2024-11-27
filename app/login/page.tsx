"use client";
import useFirebase from "@/hooks/useFirebase";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button, Spin } from "antd";
import { useState } from "react";
import Image from "next/image";

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
          router.push("/check-in");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <Button
        type="text"
        icon={
          loading ? (
            <Spin className="text-black" />
          ) : (
            <Image
              src={"/icons/google-icon.svg"}
              alt="Google Icon"
              width={0}
              height={0}
              className="w-8 h-8"
            />
          )
        }
        onClick={handleGoogleLogin}
        className="flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-600 border-none rounded-md px-8 py-4"
      >
        Sign in with Google
      </Button>
    </div>
  );
}
