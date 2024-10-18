import { useState } from "react";
import { z } from "zod";
import axios from "axios";

export const useEmailAvailability = () => {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  const checkEmailExists = async (email: string) => {
    setEmailChecking(true);
    if (!z.string().email().safeParse(email).success) {
      setEmailChecking(false);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/attendee/check-email`,
        { email },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setEmailExists(response.data.status);
    } catch (error) {
      console.error("Email check failed", error);
    } finally {
      setEmailChecking(false);
    }
  };

  return { emailChecking, emailExists, checkEmailExists };
};
