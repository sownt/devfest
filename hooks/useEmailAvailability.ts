import {useState} from "react";
import {z} from "zod";
import axios from "axios";

export const useEmailAvailability = () => {
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [availabile, setAvailabile] = useState<boolean | null>(null);

    const checkAvailability = async (email: string) => {
        setAvailabilityLoading(true);

        await new Promise(resolve => setTimeout(resolve, 200));
        if (!z.string().email().safeParse(email).success) {
            setAvailabilityLoading(false);
            setAvailabile(null);
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/attendee/email`,
                {email},
                {headers: {"Content-Type": "multipart/form-data"}}
            );

            setAvailabile(!response.data.used);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setAvailabile(null);
        } finally {
            setAvailabilityLoading(false);
        }
    };

    return {availabilityLoading, availabile, checkAvailability};
};
