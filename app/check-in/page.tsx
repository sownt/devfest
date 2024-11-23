"use client";
import { centerText } from "@/misc/tracker";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Modal, Spin } from "antd";
import axios from "axios";
import { useState } from "react";

export default function CheckInPage() {
  const [id, setId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [spin, setSpin] = useState(false);

  async function checkIn(ticketId: string) {
    try {
      setConfirmLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/check-in/${ticketId}`,
        { withCredentials: true, validateStatus: (status) => status !== 500 }
      );
      alert(res.data["message"]);
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
        setTicket(res.data);
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
    <Spin spinning={spin}>
      <div className="relative isolate flex flex-col min-h-svh w-full bg-slate-50/60">
        <div id="about" className="pt-24 px-4">
          <div className="mx-auto max-w-3xl px-4">
            <Scanner
              paused={id !== ""}
              allowMultiple={true}
              scanDelay={1000}
              components={{ tracker: centerText }}
              onScan={(result) => getTicket(result[0].rawValue)}
            />
            <Modal
              title="Ticket Information"
              open={ticket !== null}
              onOk={() => checkIn(id)}
              okText="Check In"
              confirmLoading={confirmLoading}
              onCancel={() => {
                setTicket(null);
                setId("");
              }}
            >
              <div>{JSON.stringify(ticket, null, 4)}</div>
            </Modal>
          </div>
        </div>
      </div>
    </Spin>
  );
}
