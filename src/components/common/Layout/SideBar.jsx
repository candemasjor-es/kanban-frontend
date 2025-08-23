import * as React from "react";
import {
    Drawer,
    Toolbar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    ListSubheader,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import { boardsApi } from "../../../utils/api";

const DRAWER_WIDTH = 264;

function SideBarContent({ onNavigate }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [boards, setBoards] = React.useState([]);

    React.useEffect(() => {
        let alive = true;
        boardsApi
            .list()
            .then((list) => alive && setBoards(list || []))
            .catch(() => setBoards([]));
        return () => {
            alive = false;
        };
    }, []);

    const go = (to) => {
        onNavigate?.();
        navigate(to);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar sx={{ px: 2 }}>
                <Typography variant="h6" fontWeight={800} noWrap>
                    Kanban
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 1 }}>
                <ListItemButton
                    selected={location.pathname === "/"}
                    onClick={() => go("/")}
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItemButton>
            </List>

            <List
                subheader={<ListSubheader disableSticky>Boards</ListSubheader>}
                sx={{ px: 1 }}
            >
                {boards.map((b) => (
                    <ListItemButton
                        key={b.id}
                        selected={location.pathname === `/kanban/${b.id}`}
                        onClick={() => go(`/kanban/${b.id}`)}
                        sx={{ borderRadius: 2, mb: 0.5 }}
                    >
                        <ListItemIcon>
                            <ViewKanbanIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={b.name || b.title || `Board ${b.id}`}
                        />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <List sx={{ px: 1, py: 1 }}>
                <ListItemButton onClick={() => go("/settings")}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ajustes" />
                </ListItemButton>
            </List>
            <Box sx={{ p: 2, fontSize: 12, opacity: 0.7 }}>
                v1.0 • React + MUI
            </Box>
        </Box>
    );
}

export default function SideBar({
    variant = "permanent",
    open = false,
    onClose,
}) {
    const paperSx = { width: DRAWER_WIDTH, boxSizing: "border-box" };
    if (variant === "temporary") {
        return (
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": paperSx,
                }}
            >
                <SideBarContent onNavigate={onClose} />
            </Drawer>
        );
    }
    return (
        <Drawer
            variant="permanent"
            open
            sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": paperSx,
            }}
        >
            <SideBarContent />
        </Drawer>
    );
}
export const SIDEBAR_WIDTH = DRAWER_WIDTH;
