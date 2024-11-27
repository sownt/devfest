"use client";
import { centerText } from "@/misc/tracker";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Modal, notification, Spin } from "antd";
import axios from "axios";
import { useState } from "react";
import logo from "@/public/logos/logo_colorful.png";
import Image from "next/image";
import { Button, Input, Space } from "antd";
const { Compact } = Space;

interface Attendee {
  birthday: string;
  checked_in: string;
  company_email: string;
  email: string;
  event_id: number;
  event_name: string;
  experience: string;
  job_title: string;
  linked_in: string;
  name: string;
  used: boolean;
}

export default function CheckInPage() {
  const [id, setId] = useState("");
  const [ticket, setTicket] = useState<Attendee | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [spin, setSpin] = useState(false);

  async function checkIn(ticketId: string) {
    try {
      setConfirmLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/check-in/${ticketId}`,
        { withCredentials: true, validateStatus: (status) => status !== 500 }
      );
      notification.success({ message: res.data["message"] });
    } catch (error) {
      alert(error);
    } finally {
      setConfirmLoading(false);
      setId("");
      setTicket(null);
    }
  }

  async function getTicket(ticketId: string) {
    try {
      setId(ticketId);
      setSpin(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/ticket/${ticketId}`,
        { withCredentials: true, validateStatus: (status) => status !== 500 }
      );
      setSpin(false);
      if (res.status === 200) {
        const parsedData: Attendee = res.data;
        setTicket(parsedData);
      } else {
        alert(res.data["message"]);
        setId("");
      }
    } catch (error) {
      alert(error);
      setId("");
      setSpin(false);
    }
  }

  return (
    <div className="relative isolate flex flex-col min-h-svh w-full bg-slate-200 items-center justify-center">
      <div className="flex flex-col lg:flex-row mx-auto max-w-6xl w-full p-8 gap-4">
        <div className="flex lg:flex-1 flex-col gap-4">
          <div className="flex">
            <Image className="h-8 w-auto" src={logo} alt="GDG Cloud Hanoi" />
          </div>
          <div className="p-4 rounded-lg shadow-lg bg-white">
            <Spin spinning={spin}>
              <div className="aspect-square rounded-md overflow-hidden">
                <Scanner
                  paused={id !== ""}
                  allowMultiple={true}
                  scanDelay={1500}
                  components={{
                    tracker: centerText,
                    finder: false,
                    torch: false,
                  }}
                  onScan={(result) =>
                    spin || ticket !== null
                      ? null
                      : getTicket(result[0].rawValue)
                  }
                />
              </div>
            </Spin>
          </div>
          <Compact className="shadow-lg w-full">
            <Input
              placeholder="Nhập ticket id..."
              size="large"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <Button
              type="primary"
              size="large"
              onClick={(e) => {
                e.preventDefault();
                getTicket(id);
              }}
            >
              Kiểm tra
            </Button>
          </Compact>
        </div>
        <div className="flex lg:flex-1"></div>
      </div>
      <Modal
        centered
        title="Thông tin vé"
        open={ticket !== null}
        onOk={ticket?.used ? undefined : () => checkIn(id)}
        okText={ticket?.used ? undefined : "Check In"}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setTicket(null);
          setId("");
        }}
        footer={ticket?.used ? null : undefined}
        cancelText="Huỷ"
      >
        <div className="grid grid-cols-3 gap-4 my-8">
          <div className="font-semibold">Phiên</div>
          <div className="font-semibold text-red-700 col-span-2">
            {ticket?.event_name}
          </div>
          {ticket !== null ? (
            <>
              <div className="font-semibold">Checked In</div>
              <div className="font-semibold text-red-700 col-span-2">
                {ticket.used
                  ? new Date(ticket.checked_in).toLocaleString("vi-VN")
                  : "NA"}
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="font-semibold">Họ và tên</div>
          <div className="col-span-2">{ticket?.name}</div>
          <div className="font-semibold">Năm sinh</div>
          <div className="col-span-2">{ticket?.birthday}</div>
          <div className="font-semibold">Nghề nghiệp</div>
          <div className="col-span-2">{ticket?.job_title}</div>
          <div className="font-semibold">Kinh nghiệm</div>
          <div className="col-span-2">{ticket?.experience}</div>
        </div>
      </Modal>
    </div>
  );
}
