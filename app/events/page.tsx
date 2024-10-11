"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Schema validation với zod
const formSchema = z.object({
    name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số").max(11, "Số điện thoại không hợp lệ"),
    gender: z.string().optional(),
    topic: z.string().min(1, "Vui lòng chọn chủ đề quan tâm"),
    experience: z.string().optional(),
    job_title: z.string().min(2, "Chức danh công việc không được để trống"),
    company: z.string().min(2, "Tên công ty không được để trống"),
    linkedin: z.string().url("Đường dẫn LinkedIn không hợp lệ").optional(),
    question: z.string().optional()
})

export default function RegisterEvent() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = (data: any) => {
        console.log(data)
    }

    return (
        <div className="mx-auto max-w-lg space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold pt-5">Đăng ký sự kiện GDG Cloud Ha Noi DevFest 2024</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Họ và tên */}
                <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" placeholder="John Doe" {...register("name")} className="h-12 rounded-lg bg-gray-100" />
                    {errors.name?.message && <p className="text-red-500">{String(errors.name.message)}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="example@mail.com" {...register("email")} className="h-12 rounded-lg bg-gray-100" />
                    {errors.email?.message && <p className="text-red-500">{String(errors.email.message)}</p>}
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="0123456789" {...register("phone")} className="h-12 rounded-lg bg-gray-100" />
                    {errors.phone?.message && <p className="text-red-500">{String(errors.phone.message)}</p>}
                </div>

                {/* Giới tính (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính (Optional)</Label>
                    <Select {...register("gender")}>
                        <SelectTrigger className="h-12 rounded-lg bg-gray-100">
                            <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Chủ đề quan tâm */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="topic">Chủ đề quan tâm</Label>
                    <Input id="topic" placeholder="AI, Cloud, DevOps..." {...register("topic")} className="h-12 rounded-lg bg-gray-100" />
                    {errors.topic?.message && <p className="text-red-500">{String(errors.topic.message)}</p>}
                </div>

                {/* Kinh nghiệm (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="experience">Kinh nghiệm (Optional)</Label>
                    <Input id="experience" placeholder="2 năm, Junior Developer..." {...register("experience")} className="h-12 rounded-lg bg-gray-100" />
                </div>

                {/* Chức danh công việc */}
                <div className="space-y-2">
                    <Label htmlFor="job_title">Chức danh công việc</Label>
                    <Input id="job_title" placeholder="Backend Developer" {...register("job_title")} className="h-12 rounded-lg bg-gray-100" />
                    {errors.job_title?.message && <p className="text-red-500">{String(errors.job_title.message)}</p>}
                </div>

                {/* Công ty / Tổ chức */}
                <div className="space-y-2">
                    <Label htmlFor="company">Công ty / Tổ chức</Label>
                    <Input id="company" placeholder="ABC Corp." {...register("company")} className="h-12 rounded-lg bg-gray-100" />
                    {errors.company?.message && <p className="text-red-500">{String(errors.company.message)}</p>}
                </div>

                {/* LinkedIn profile (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn profile (Optional)</Label>
                    <Input id="linkedin" type="url" placeholder="https://www.linkedin.com/in/yourprofile" {...register("linkedin")} className="h-12 rounded-lg bg-gray-100" />
                    {errors.linkedin?.message && <p className="text-red-500">{String(errors.linkedin.message)}</p>}
                </div>

                {/* Câu hỏi cho BTC (Optional) */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="question">Câu hỏi cho BTC (Optional)</Label>
                    <Textarea id="question" placeholder="Bạn có câu hỏi nào dành cho ban tổ chức?" {...register("question")} className="rounded-lg" />
                </div>

                {/* Submit button */}
                <Button type="submit" className="w-full h-12 rounded-xl bg-blue-500 text-white font-bold sm:col-span-2">Đăng ký</Button>
            </form>
        </div>
    )
}
