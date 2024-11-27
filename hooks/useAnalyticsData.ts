import {useQuery} from "@tanstack/react-query";
import axios from "axios";

type AnalyticsDataProps = {
    type: 'summary' | 'gender';
};

export const useAnalyticsData = ({type} : AnalyticsDataProps) => {
    return useQuery({
        queryKey: [type],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/analytics/${type}`,
                {withCredentials: true}
            );
            return res.data;
        }
    });
}