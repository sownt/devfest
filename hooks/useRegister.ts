import { useState } from "react";
import { RegisterFormFields } from "@/types/forms";
import axios from "axios";

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const postFormData = async (formData: RegisterFormFields) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
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
