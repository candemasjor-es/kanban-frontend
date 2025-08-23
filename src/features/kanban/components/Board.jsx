import * as React from "react";
import { useEffect, useCallback } from "react";
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
import StrictModeDroppable from "./StrictModeDroppablea";
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
    const columns = useSelector(selectColumns, shallowEqual);
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
                return;
            }

            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            )
                return;

            const payload = {
                cardId: String(draggableId),
                fromColumnId: String(source.droppableId), // para estado local
                toColumnId: Number(destination.droppableId), // backend numérico
                toPosition: Number(destination.index),
            };

            console.debug("[DnD move]", payload);
            dispatch(moveCardLocal(payload));
            dispatch(moveCard(payload));
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

            <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable
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
                </StrictModeDroppable>
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
