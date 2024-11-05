import type {Metadata} from "next";
import {ReactQueryProvider} from "@/components/ReactQueryProvider/ReactQueryProvider";
import React from "react";

export const metadata: Metadata = {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
    title: "DevFest Cloud Hanoi 2024 | Report",
    description: "Event by GDG Cloud Hanoi",
};

export default async function Layout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>
    );
    // return (
    //     <ReactQueryProvider>
    //         <div
    //             className={"relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 " +
    //                 "dark:bg-zinc-900 dark:lg:bg-zinc-950"}>
    //             <div className={"fixed inset-y-0 left-0 w-64 max-lg:hidden"}>
    //             </div>
    //             <main className={"flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2"}>
    //                 <div
    //                     className={"grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 " +
    //                         "lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10"}>
    //                     <div className={"mx-auto max-w-6xl"}>
    //                         {children}
    //                     </div>
    //                 </div>
    //             </main>
    //         </div>
    //     </ReactQueryProvider>
    // );
}
