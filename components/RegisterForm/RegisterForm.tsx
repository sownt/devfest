"use client";

import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
  Spin,
  Tooltip,
} from "antd";
import { FaCheck } from "react-icons/fa6";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useEmailAvailability } from "@/hooks/useEmailAvailability";
import { useRegistration } from "@/hooks/useRegister";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  registerFormDefault,
  RegisterFormFields,
  registerFormSchema,
} from "@/types/forms";

const { Item } = Form;
const { TextArea } = Input;
dayjs.extend(customParseFormat);
const yearFormat = "YYYY";

export default function RegisterForm() {
  const [loaded, setLoaded] = useState(false);
  const { availabilityLoading, availabile, checkAvailability } =
    useEmailAvailability();
  const { isLoading, postFormData } = useRegistration();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerFormDefault,
  });

  const onSubmit = async (data: RegisterFormFields) => {
    if (!availabile) {
      return;
    }
    try {
      const res = await postFormData(data);
      if (res.status === 200) {
        notification.success({ message: "Register successful!" });
        reset();
      } else {
        throw new Error(res.statusText || "Something went wrong");
      }
    } catch {
      notification.error({ message: "Registration failed" });
    }
  };
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email) {
      await checkAvailability(email);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`mx-auto max-w-6xl w-full bg-white rounded-xl px-6 py-8 sm:px-12 sm:py-16 shadow-lg space-y-6 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Register for Event Ticket</h1>
        <h2>
          {
            "Don't miss out on this opportunity to be part of an exciting event!"
          }
        </h2>
      </div>
      <Spin spinning={isLoading}>
        <Form
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          size="large"
          className="grid grid-cols-2 gap-x-4 sm:gap-x-8"
        >
          <Item
            label="Full Name"
            validateStatus={errors.name ? "error" : ""}
            className="col-span-2"
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="John Doe"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  suffix={
                    errors.name ? (
                      <Tooltip title={errors.name?.message}>
                        <InfoCircleOutlined style={{ color: "red" }} />
                      </Tooltip>
                    ) : (
                      <></>
                    )
                  }
                />
              )}
            />
          </Item>

          <Item
            label="Year of Birth"
            validateStatus={errors.birthday ? "error" : ""}
          >
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  picker="year"
                  placeholder="YYYY"
                  format={yearFormat}
                  minDate={dayjs("1900", yearFormat)}
                  maxDate={dayjs("2024", yearFormat)}
                  value={field.value ? dayjs(field.value, yearFormat) : null}
                  onChange={(_, dateString) => {
                    field.onChange(Array.isArray(dateString) ? "" : dateString);
                  }}
                  className="w-full"
                />
              )}
            />
          </Item>

          <Item
            label="Gender"
            validateStatus={errors.gender ? "error" : ""}
            // help={errors.gender?.message}
          >
            <Select
              allowClear
              value={getValues("gender") !== "" ? getValues("gender") : null}
              onChange={(value) =>
                setValue("gender", value, { shouldValidate: true })
              }
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select gender"
            />
          </Item>

          <Item
            label="Email"
            validateStatus={
              errors.email || (availabile !== null && !availabile)
                ? "error"
                : ""
            }
            className="col-span-2 sm:col-span-1"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="example@mail.com"
                  suffix={
                    errors.email ? (
                      <Tooltip title={errors.email?.message}>
                        <InfoCircleOutlined style={{ color: "red" }} />
                      </Tooltip>
                    ) : availabilityLoading ? (
                      <Spin size="small" />
                    ) : availabile === null ? (
                      <></>
                    ) : availabile ? (
                      <FaCheck />
                    ) : (
                      <Tooltip title={"This email is already used"}>
                        <InfoCircleOutlined style={{ color: "red" }} />
                      </Tooltip>
                    )
                  }
                  {...field}
                  onChange={(e) => {
                    handleEmailChange(e);
                    field.onChange(e.target.value);
                  }}
                />
              )}
            />
          </Item>

          <Item
            label="Years of Experience"
            validateStatus={errors.experience ? "error" : ""}
            // help={errors.experience?.message}
            className="col-span-2 sm:col-span-1"
          >
            <Select
              value={
                getValues("experience") !== "" ? getValues("experience") : null
              }
              onChange={(value) =>
                setValue("experience", value, { shouldValidate: true })
              }
              options={[
                { value: "0-1", label: "0 - 1" },
                { value: "1-2", label: "1 - 2" },
                { value: "2-3", label: "2 - 3" },
                { value: "3-4", label: "3 - 4" },
                { value: "4-5", label: "4 - 5" },
                { value: "5+", label: "5+" },
              ]}
              placeholder="Select experience"
            />
          </Item>

          <Item
            label="Job Title"
            validateStatus={errors.job_title ? "error" : ""}
            // help={errors.job_title?.message}
            className="col-span-2 sm:col-span-1"
          >
            <Controller
              name="job_title"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Cloud Engineer"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  suffix={
                    errors.job_title ? (
                      <Tooltip title={errors.job_title?.message}>
                        <InfoCircleOutlined style={{ color: "red" }} />
                      </Tooltip>
                    ) : (
                      <></>
                    )
                  }
                />
              )}
            />
          </Item>

          <Item
            label="Sessions"
            validateStatus={errors.sessions ? "error" : ""}
            // help={errors.sessions?.message}
            className="col-span-2 sm:col-span-1"
          >
            <Select
              value={
                getValues("sessions") !== "" ? getValues("sessions") : null
              }
              onChange={(value) =>
                setValue("sessions", value, { shouldValidate: true })
              }
              options={[
                { value: "morning", label: "Morning Workshop" },
                { value: "afternoon", label: "Afternoon Tech Conference" },
                { value: "both", label: "Both of them" },
              ]}
              placeholder="Select sessions"
            />
          </Item>

          <Item
            label="Phone Number"
            tooltip={{ title: "Optional", icon: <InfoCircleOutlined /> }}
            className="col-span-2 sm:col-span-1"
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="0123456789"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Item>

          <Item
            label="Company Email"
            tooltip={{ title: "Optional", icon: <InfoCircleOutlined /> }}
            className="col-span-2 sm:col-span-1"
          >
            <Controller
              name="company_email"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="name@company.com"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Item>

          <Item
            label="LinkedIn"
            tooltip={{ title: "Optional", icon: <InfoCircleOutlined /> }}
            className="col-span-2"
          >
            <Controller
              name="linkedin"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Item>

          <Item
            label="Questions for Organizer"
            tooltip={{ title: "Optional", icon: <InfoCircleOutlined /> }}
            className="col-span-2"
          >
            <Controller
              name="question"
              control={control}
              render={({ field }) => (
                <TextArea
                  placeholder="Do you have any questions for the organizers?"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Item>

          <Button
            block
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full h-12 rounded-xl bg-[#34a853]/80 hover:bg-[#34a853]/90 text-white font-bold col-span-2 hover:shadow-lg"
          >
            Register
          </Button>
        </Form>
      </Spin>
    </div>
  );
}
