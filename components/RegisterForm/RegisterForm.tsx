"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import axios from 'axios';
import LoadingOverlay from "@/components/LoadingOverlay"
import Toast from "../ui/toast"

export type FormFields = {
    name: string;
    birthday: string;
    gender: string;
    email: string;
    phone?: string;
    topic: string;
    experience: string;
    job_title: string;
    company?: string;
    linkedin?: string;
    question?: string;
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/attendee/check-email`,
        { email: email },
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.status;
};

export const postFormData = async (formData: FormFields): Promise<any> => {
    const emailExists = await checkEmailExists(formData.email);

    if (emailExists) {
        throw new Error('Email already exists. Please use a different email.');
    }

    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/attendee/attend`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response;
};

const formSchema = z.object({
    name: z.string().min(1, "Full name cannot be empty"),
    birthday: z.string()
        .refine(val => {
            const year = Number(val);
            return !isNaN(year) && year >= 1900 && year <= 2024;
        }, {
            message: "Invalid year",
        }),
    gender: z.string(),
    email: z.string().min(1, "Email cannot be empty").email("Invalid email"),
    phone: z.string().optional(),
    topic: z.string(),
    experience: z.string(),
    job_title: z.string().min(1, "Job title cannot be empty"),
    company: z.string().optional(),
    linkedin: z.string().optional(),
    question: z.string().optional()
})

export default function RegisterForm() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [toastData, setToastData] = useState({ title: '', description: '' });

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            birthday: "",
            gender: "",
            email: "",
            phone: "",
            topic: "",
            experience: "",
            job_title: "",
            company: "",
            linkedin: "",
            question: ""
        },
    })

    const onSubmit = async (data: FormFields) => {
        try {
            setIsLoading(true);
            const res = await postFormData(data);
            
            if (res.status === 200) {
                showToast("", "Register successful!");
                reset();
            } else {
                const errorMessage = res.statusText || "Something went wrong";
                showToast("Error", errorMessage);
            }
        } catch (error: any) {
            // Catch and handle errors, especially network errors or server errors
            if (axios.isAxiosError(error)) {
                // Axios-specific error handling
                if (error.response) {
                    // Server responded with a status code outside 2xx range
                    showToast("Error", error.response.data?.message || "Request failed");
                } else if (error.request) {
                    // Request was made but no response received
                    showToast("Error", "No response received from the server");
                } else {
                    // Something went wrong setting up the request
                    showToast("Error", error.message);
                }
            } else {
                // Non-Axios errors, or other types of errors
                showToast("Error", error.message || "An unexpected error occurred");
            }
        } finally {
            await new Promise(r => setTimeout(r, 500));
            setIsLoading(false);
        }
    }

    const showToast = (title: string, description: string) => {
        setToastData({ title, description });
        setOpen(true);
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <Toast
                title={toastData.title}
                description={toastData.description}
                open={open}
                onOpenChange={setOpen}
            />
            <div className={`mx-auto max-w-6xl w-full bg-white rounded-xl p-12 shadow-lg space-y-6 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="space-y-2 mb-8">
                    <h1 className="text-3xl font-bold">Register for Event Ticket</h1>
                    <h2>{"Don't miss out on this opportunity to be part of an exciting event!"}</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" {...register("name")} className="h-12 rounded-lg bg-gray-100" />
                        {errors.name?.message && <p className="text-red-500">{String(errors.name.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="birthday">Year of birth (Optional)</Label>
                        <Input id="birthday" placeholder="1996" {...register("birthday")} className="h-12 rounded-lg bg-gray-100" />
                        {errors.birthday?.message && <p className="text-red-500">{String(errors.birthday.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                            value={getValues("gender")}
                            onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}>
                            <SelectTrigger className="h-12 rounded-lg bg-gray-100">
                                <SelectValue defaultValue={""} placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender?.message && <p className="text-red-500">{String(errors.gender.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="example@mail.com" {...register("email")} className="h-12 rounded-lg bg-gray-100" />
                        {errors.email?.message && <p className="text-red-500">{String(errors.email.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input id="phone" type="tel" placeholder="0123456789" {...register("phone")} className="h-12 rounded-lg bg-gray-100" />
                        {errors.phone?.message && <p className="text-red-500">{String(errors.phone.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic of Interest</Label>
                        <Select
                            value={getValues("topic")}
                            onValueChange={(value) => setValue("topic", value, { shouldValidate: true })}>
                            <SelectTrigger className="h-12 rounded-lg bg-gray-100">
                                <SelectValue placeholder="Select topic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ai">AI</SelectItem>
                                <SelectItem value="cloud">Cloud</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.topic?.message && <p className="text-red-500">{String(errors.topic.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experience">Years of experience</Label>
                        <Select
                            value={getValues("experience")}
                            onValueChange={(value) => setValue("experience", value, { shouldValidate: true })}>
                            <SelectTrigger className="h-12 rounded-lg bg-gray-100">
                                <SelectValue placeholder="Select a range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0-1">0 - 1</SelectItem>
                                <SelectItem value="1-2">1 - 2</SelectItem>
                                <SelectItem value="2-3">2 - 3</SelectItem>
                                <SelectItem value="3-4">3 - 4</SelectItem>
                                <SelectItem value="4-5">4 - 5</SelectItem>
                                <SelectItem value="5+">5+</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.experience?.message && <p className="text-red-500">{String(errors.experience.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="job_title">Job Title</Label>
                        <Input id="job_title" placeholder="Cloud Engineer" {...register("job_title")} className="h-12 rounded-lg bg-gray-100" />
                        {errors.job_title?.message && <p className="text-red-500">{String(errors.job_title.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company">Company Email (Optional)</Label>
                        <Input id="company" placeholder="name@company.com" {...register("company")} className="h-12 rounded-lg bg-gray-100" />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                        <Input id="linkedin" placeholder="https://www.linkedin.com/in/yourprofile" {...register("linkedin")} className="h-12 rounded-lg bg-gray-100" />
                    </div>

                    {/* Question for Organizers (Optional) */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="question">Question for Organizers (Optional)</Label>
                        <Textarea id="question" placeholder="Do you have any questions for the organizers?" {...register("question")} className="rounded-lg" />
                    </div>

                    {/* Submit button */}
                    <Button type="submit" className="w-full h-12 rounded-xl bg-[#34a853]/80 hover:bg-[#34a853]/90 text-white font-bold sm:col-span-2">Register</Button>
                </form>
            </div>
        </>
    )
}
