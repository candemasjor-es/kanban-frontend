import * as React from "react";
import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

export default function CardItem({ card }) {
    return (
        <Card sx={{ mb: 1.5, cursor: "grab" }} variant="outlined">
            <CardContent>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                    gutterBottom
                >
                    {card.title}
                </Typography>
                {card.description && (
                    <Typography
                        variant="body2"
                        sx={{ opacity: 0.85 }}
                        gutterBottom
                    >
                        {card.description}
                    </Typography>
                )}
                {!!card.tags?.length && (
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, flexWrap: "wrap" }}
                    >
                        {card.tags.map((t) => (
                            <Chip key={t} label={t} size="small" />
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
