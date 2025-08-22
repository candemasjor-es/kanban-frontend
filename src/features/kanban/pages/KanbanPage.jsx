import * as React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Board from "../components/Board";
import Layout from "../../../components/common/Layout/Layout";

export default function KanbanPage() {
    const { boardId } = useParams();
    const numericId = Number(boardId);
    return (
        <Layout title="Tablero Kanban">
            <Box>
                <Board boardId={numericId} />
            </Box>
        </Layout>
    );
}
