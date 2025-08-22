import * as React from "react";
import { Box, Toolbar, Container } from "@mui/material";
import SideBar, { SIDEBAR_WIDTH } from "./SideBar";
import TopBar from "./TopBar";

export default function Layout({ title, children }) {
    const [open, setOpen] = React.useState(false);
    const toggle = () => setOpen((o) => !o);
    const close = () => setOpen(false);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <SideBar variant="temporary" open={open} onClose={close} />
            <SideBar variant="permanent" />
            <Box sx={{ flexGrow: 1, ml: { md: `${SIDEBAR_WIDTH}px` } }}>
                <TopBar title={title} onMenuClick={toggle} />
                <Toolbar />
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
