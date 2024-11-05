"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import {BarChart, DonutChart, Legend} from '@tremor/react';
import Summary from "@/app/reports/_components/Summary";

export default function ReportPage() {
    const [gender, setGender] = useState([]);
    const [birthday, setBirthday] = useState([]);
    const [experience, setExperience] = useState([]);

    useEffect(
        () => {
            axios.get(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/analytics/gender`,
                {withCredentials: true}
            ).then(res => setGender(res.data));
            axios.get(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/analytics/birthday`,
                {withCredentials: true}
            ).then(res => setBirthday(res.data));
            axios.get(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/analytics/experience`,
                {withCredentials: true}
            ).then(res => setExperience(res.data));
        },
        []
    );

    const dataFormatter = (number: number) =>
        Intl.NumberFormat('us').format(number).toString();

    return (
        <div className="relative isolate min-h-svh w-full px-24 py-16">
            <div className={"flex flex-col max-w-6xl mx-auto w-full gap-8"}>
                <Summary />
                <div className={"grid grid-cols-2 gap-8"}>
                    {experience && <BarChart
                        data={experience}
                        index="experience"
                        categories={['count']}
                        colors={['blue']}
                        valueFormatter={dataFormatter}
                        yAxisWidth={48}
                        showAnimation={true}
                        showLegend={false}
                    />}
                    {birthday && <BarChart
                        data={birthday}
                        index="birthday"
                        categories={['count']}
                        colors={['blue']}
                        yAxisWidth={48}
                        showAnimation={true}
                        showLegend={false}
                    />}
                    {gender && <div className={"flex flex-col items-end gap-8"}>
                        <Legend
                            categories={['male', 'female', 'other']}
                            colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
                            className="max-w-xs"
                        />
                        <DonutChart
                            data={gender}
                            variant={"donut"}
                            category="count"
                            index="gender"/>
                    </div>}
                </div>
            </div>
        </div>
    );
}