import * as React from "react";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import AppRouter from "./routes/AppRouter";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
    return null;
}

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<LinearProgress />}>
                <AppRouter />
            </Suspense>
        </>
    );
}
