import * as React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function TopBar({ title = "Tablero", onMenuClick }) {
    return (
        <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "saturate(180%) blur(8px)",
                backgroundColor: "rgba(23,25,31,0.85)",
            }}
        >
            <Toolbar>
                <IconButton
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { md: "none" } }}
                    aria-label="Abrir menú"
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    );
}
