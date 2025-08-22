import * as React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import CardItem from "./CardItem";

export default function Column({ column, index }) {
    const colId = String(column.id);
    return (
        <Draggable draggableId={colId} index={index}>
            {(provided) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{ width: 320, mr: 2 }}
                >
                    <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "background.paper" }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, mb: 1 }}
                            {...provided.dragHandleProps}
                        >
                            {column.title}
                        </Typography>
                        <Droppable droppableId={colId} type="CARD">
                            {(dropProvided, snapshot) => (
                                <Box
                                    ref={dropProvided.innerRef}
                                    {...dropProvided.droppableProps}
                                    sx={{
                                        minHeight: 20,
                                        transition:
                                            "background-color 150ms ease",
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
            )}
        </Draggable>
    );
}
