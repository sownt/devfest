import { z } from "zod";

export type RegisterFormFields = {
  name: string;
  birthday: string;
  gender: string;
  email: string;
  sessions: string;
  experience: string;
  job_title: string;
  phone?: string;
  company_email?: string;
  linkedin?: string;
  question?: string;
};

export const registerFormSchema = z.object({
  name: z.string().min(1, "Required"),
  birthday: z.string().min(4, "Required"),
  gender: z.string().min(1, "Required"),
  email: z.string().min(1, "Required").email("Invalid email"),
  sessions: z.string().min(1, "Required"),
  experience: z.string().min(1, "Required"),
  job_title: z.string().min(1, "Required"),
  phone: z.string().optional(),
  company_email: z.string().optional(),
  linkedin: z.string().optional(),
  question: z.string().optional(),
});

export const registerFormDefault: RegisterFormFields = {
  name: "",
  birthday: "",
  gender: "",
  email: "",
  phone: "",
  sessions: "",
  experience: "",
  job_title: "",
  company_email: "",
  linkedin: "",
  question: "",
};
