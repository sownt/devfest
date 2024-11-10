"use client"
import {Scanner} from "@yudiel/react-qr-scanner";
import axios from "axios";
import { centerText } from "./tracker";

export default function CheckInPage() {
    return (
        <div className="relative isolate flex flex-col min-h-svh w-full bg-slate-50/60">
            <div id="about" className="pt-24 px-4">
                <div className="mx-auto max-w-3xl px-4">
                    <Scanner
                        allowMultiple={true}
                        scanDelay={1000}
                        components={{tracker: centerText}}
                        onScan={async (result) => {
                            try {
                                const res = await axios.get(
                                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/check-in?id=${result[0].rawValue}`,
                                    {withCredentials: true},
                                );
                                console.log(res);
                            } catch (error) {
                                console.error(error);
                            }
                        }}/>
                </div>
            </div>
        </div>
    );
}