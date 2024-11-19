import { QRCode } from "antd";
import React from "react";
import axios from "axios";

export default async function TicketPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/attendee/tickets?id=${params.id}`,
    { validateStatus: () => true }
  );

  if (res.status !== 200) {
    return <div>Error</div>;
  }

  const tickets = (await res.data) as [];

  return (
    <div className="relative">
      <div className="relative isolate flex flex-col min-h-svh w-full bg-slate-50/60">
        <section className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="mx-auto max-w-6xl px-8">
            <div className="flex flex-col gap-16">
              {tickets.map((ticket, i) =>
                ticket.secret ? <QRCode key={i} value={ticket.secret} /> : null
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
