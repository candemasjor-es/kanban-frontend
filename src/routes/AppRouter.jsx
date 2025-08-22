import * as React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import KanbanPage from "../features/kanban/pages/KanbanPage";
import { boardsApi } from "../utils/api";

function KanbanIndexRedirect() {
    const navigate = useNavigate();
    React.useEffect(() => {
        let mounted = true;
        boardsApi
            .list()
            .then((list) => {
                if (!mounted) return;
                const firstId = list?.[0]?.id;
                navigate(firstId ? `/kanban/${firstId}` : `/kanban/1`, {
                    replace: true,
                });
            })
            .catch(() => navigate(`/kanban/1`, { replace: true }));
        return () => {
            mounted = false;
        };
    }, [navigate]);
    return null;
}

function SettingsPage() {
    return <div>Ajustes…</div>;
}

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/kanban" replace />} />
            <Route path="/kanban" element={<KanbanIndexRedirect />} />
            <Route path="/kanban/:boardId" element={<KanbanPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<div>404</div>} />
        </Routes>
    );
}
