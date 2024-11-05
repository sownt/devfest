"use client"

import {AreaChart} from "@tremor/react";
import {useAnalyticsData} from "@/hooks/useAnalyticsData";
import dayjs from "dayjs";

export default function Summary() {
    const {data} = useAnalyticsData({type: "summary"});

    const dataFormatter = (number: number) =>
        Intl.NumberFormat('us').format(number).toString();

    const mapFields = (data: []) => {
        try {
            return data.map((item: {
                date: string,
                count: number,
                accumulated_count: number,
            }) => ({
                date: dayjs(item.date).format("DD/MM"),
                'Theo ngày': item.count,
                'Tổng số': item.accumulated_count !== 0 ? item.accumulated_count : null,
            }));
        } catch {
            return [];
        }
    }

    return <div>
        <AreaChart
            className="h-80"
            data={mapFields(data)}
            index="date"
            categories={['Theo ngày', 'Tổng số']}
            colors={['indigo', 'rose']}
            valueFormatter={dataFormatter}
            yAxisWidth={60}
            showAnimation={true}
            onValueChange={(v) => console.log(v)}
        />
    </div>;
}