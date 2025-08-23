import * as React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Board from "../components/Board";
import Layout from "../../../components/common/Layout/Layout";

export default function KanbanPage() {
    const { boardId } = useParams();
    return (
        <Layout title="Default Board1">
            <Box>
                <Board boardId={Number(boardId)} />
            </Box>
        </Layout>
    );
}
