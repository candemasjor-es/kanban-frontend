// src/features/kanban/components/Column.jsx
import * as React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import CardItem from "./CardItem";

function ColumnImpl({ column }) {
    const colId = String(column.id);
    return (
        <Box sx={{ width: 320, mr: 2 }}>
            <Paper
                variant="outlined"
                sx={{ p: 2, bgcolor: "background.paper" }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    {column.title}
                </Typography>

                <Droppable droppableId={colId} type="CARD">
                    {(dropProvided, snapshot) => (
                        <Box
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}
                            sx={{
                                minHeight: 20,
                                transition: "background-color 120ms ease",
                                bgcolor: snapshot.isDraggingOver
                                    ? "action.hover"
                                    : "transparent",
                                p: 0.5,
                            }}
                        >
                            {column.cards.map((card, idx) => (
                                <Draggable
                                    key={String(card.id)}
                                    draggableId={String(card.id)}
                                    index={idx}
                                >
                                    {(dragProvided) => (
                                        <Box
                                            ref={dragProvided.innerRef}
                                            {...dragProvided.draggableProps}
                                            {...dragProvided.dragHandleProps}
                                            style={
                                                dragProvided.draggableProps
                                                    .style
                                            } // 👈 imprescindible para animar
                                        >
                                            <CardItem card={card} />
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {dropProvided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </Paper>
        </Box>
    );
}

// Memo evita rerender si no cambia la referencia de column/cards
const Column = React.memo(
    ColumnImpl,
    (prev, next) =>
        prev.column === next.column ||
        (prev.column.id === next.column.id &&
            prev.column.title === next.column.title &&
            prev.column.cards === next.column.cards)
);

export default Column;
