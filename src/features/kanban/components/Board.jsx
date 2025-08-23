// src/features/kanban/components/Board.jsx
import * as React from "react";
import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Skeleton,
    CircularProgress,
} from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import {
    fetchBoard,
    moveCard,
    moveCardLocal,
    selectKanbanLoading,
    selectColumns,
    selectBoard,
} from "../kanbanSlice";

function BoardSkeleton() {
    /* igual que ya tienes */
}

export default function Board({ boardId }) {
    const dispatch = useDispatch();
    const loading = useSelector(selectKanbanLoading);
    const columns = useSelector(selectColumns, shallowEqual);
    const board = useSelector(selectBoard);

    // ⚡️ Evita doble manejo del mismo drop (StrictMode)
    const lastDropRef = useRef(null);
    // ⚡️ No permitir otro drop mientras hay uno en vuelo (evita solapamientos)
    const inFlightRef = useRef(false);

    useEffect(() => {
        if (boardId == null || Number.isNaN(Number(boardId))) return;
        dispatch(fetchBoard(Number(boardId)));
    }, [boardId, dispatch]);

    const onDragEnd = useCallback(
        (result) => {
            const { destination, source, draggableId, type } = result;

            // Solo cards
            if (type && type !== "CARD") return;
            if (!destination) return;
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            )
                return;

            // 🛡️ Ignorar duplicados por StrictMode (mismo item y misma dst/src)
            const key = JSON.stringify({
                id: draggableId,
                s: source.droppableId,
                si: source.index,
                d: destination.droppableId,
                di: destination.index,
            });
            if (lastDropRef.current === key) return;
            lastDropRef.current = key;

            // 🛡️ Evitar múltiples requests simultáneas
            if (inFlightRef.current) return;
            inFlightRef.current = true;

            const payload = {
                cardId: String(draggableId),
                fromColumnId: String(source.droppableId),
                toColumnId: Number(destination.droppableId),
                toPosition: Number(destination.index),
            };

            // Optimista en el siguiente frame (pinta suave)
            requestAnimationFrame(() => dispatch(moveCardLocal(payload)));

            // Persistencia
            dispatch(moveCard(payload)).finally(() => {
                inFlightRef.current = false;
            });
        },
        [dispatch]
    );

    if (loading && (!columns || columns.length === 0)) return <BoardSkeleton />;
    if (!board) {
        return (
            <Box>
                <Paper sx={{ p: 2 }}>
                    <Typography>No se pudo cargar el tablero.</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            {!!board?.title && (
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {board.title}
                </Typography>
            )}

            {/* Sin droppable de columnas: solo contenedor rápido */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        overflowX: "auto",
                        pb: 2,
                        gap: 2,
                    }}
                >
                    {columns?.length ? (
                        columns.map((col) => (
                            <Column key={String(col.id)} column={col} />
                        ))
                    ) : (
                        <Box
                            sx={{
                                minWidth: 320,
                                p: 3,
                                border: "1px dashed",
                                borderColor: "divider",
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body2">
                                No hay columnas todavía.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </DragDropContext>

            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                        color: "text.secondary",
                    }}
                >
                    <CircularProgress size={16} />
                    <Typography variant="caption">Actualizando…</Typography>
                </Box>
            )}
        </Box>
    );
}
