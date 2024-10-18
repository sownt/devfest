import { useState } from "react";
import { FormFields } from "@/types/form";
import axios from "axios";

export const useRegistration = (emailExists: boolean | null) => {
  const [isLoading, setIsLoading] = useState(false);

  const postFormData = async (formData: FormFields) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
      if (emailExists) {
        throw new Error("Email already exists. Please use a different email.");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/attendee/attend`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, postFormData };
};
