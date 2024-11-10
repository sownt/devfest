import {Suspense} from "react";
import LoginPage from "@/app/login/_components/LoginPage";

export default function Page() {
    return <Suspense>
        <LoginPage/>
    </Suspense>
}