import * as React from "react";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    CircularProgress,
    Alert,
    Typography,
    Paper,
    Stack,
    Skeleton,
} from "@mui/material";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./Column";
import {
    fetchBoard,
    moveCard,
    moveCardLocal,
    reorderColumns,
    selectKanbanLoading,
    selectColumns,
    selectBoard,
} from "../kanbanSlice";

function BoardSkeleton() {
    return (
        <Stack direction="row" spacing={2} sx={{ pb: 2 }}>
            {[1, 2, 3].map((k) => (
                <Paper key={k} variant="outlined" sx={{ width: 320, p: 2 }}>
                    <Skeleton variant="text" width={140} height={28} />
                    <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                        <Skeleton variant="rounded" height={84} />
                        <Skeleton variant="rounded" height={84} />
                        <Skeleton variant="rounded" height={84} />
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}

export default function Board({ boardId }) {
    const dispatch = useDispatch();
    const loading = useSelector(selectKanbanLoading);
    const columns = useSelector(selectColumns);
    const board = useSelector(selectBoard);

    useEffect(() => {
        if (boardId == null || Number.isNaN(Number(boardId))) return;
        dispatch(fetchBoard(Number(boardId)));
    }, [boardId, dispatch]);

    const onDragEnd = useCallback(
        (result) => {
            const { destination, source, type, draggableId } = result;
            if (!destination) return;

            if (type === "COLUMN") {
                if (destination.index === source.index) return;
                dispatch(
                    reorderColumns({
                        sourceIndex: source.index,
                        destinationIndex: destination.index,
                    })
                );
                // Persistir reorden de columnas (opcional):
                // columnsApi.update({ columnId: columns[source.index].id, boardId, toIndex: destination.index });
                return;
            }

            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            )
                return;

            const payload = {
                cardId: draggableId,
                boardId: Number(boardId),
                fromColumnId: source.droppableId,
                toColumnId: destination.droppableId,
                toIndex: destination.index,
            };

            dispatch(moveCardLocal(payload));
            dispatch(moveCard(payload));
        },
        [dispatch, boardId]
    );

    if (loading && (!columns || columns.length === 0)) {
        return <BoardSkeleton />;
    }

    if (!board) {
        return <Alert severity="error">No se pudo cargar el tablero.</Alert>;
    }

    return (
        <Box>
            {board?.title && (
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {board.title}
                </Typography>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="board"
                    direction="horizontal"
                    type="COLUMN"
                >
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                overflowX: "auto",
                                pb: 2,
                                gap: 2,
                            }}
                        >
                            {columns?.length ? (
                                columns.map((col, idx) => (
                                    <Column
                                        key={String(col.id)}
                                        column={col}
                                        index={idx}
                                    />
                                ))
                            ) : (
                                <Box
                                    sx={{
                                        minWidth: 320,
                                        p: 3,
                                        border: "1px dashed",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        color: "text.secondary",
                                    }}
                                >
                                    <Typography variant="body2">
                                        No hay columnas todavía.
                                    </Typography>
                                    <Typography variant="caption">
                                        Crea una columna para empezar.
                                    </Typography>
                                </Box>
                            )}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
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
