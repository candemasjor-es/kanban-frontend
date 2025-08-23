import * as React from "react";
import { Droppable } from "@hello-pangea/dnd";

/**
 * Fix React 18 + StrictMode para @hello-pangea/dnd.
 */
export default function StrictModeDroppable({ children, ...props }) {
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
        const raf = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(raf);
            setEnabled(false);
        };
    }, []);

    if (!enabled) return null;
    return <Droppable {...props}>{children}</Droppable>;
}
