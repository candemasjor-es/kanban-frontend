import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        secondary: { main: "#9c27b0" },
        background: { default: "#f7f8fa", paper: "#ffffff" },
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: [
            "Inter",
            "system-ui",
            "-apple-system",
            "Segoe UI",
            "Roboto",
            "Ubuntu",
            "sans-serif",
        ].join(","),
        h6: { fontWeight: 700 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: { boxShadow: "0 4px 16px rgba(0,0,0,0.05)" },
            },
        },
        MuiButton: { defaultProps: { variant: "contained" } },
    },
});

export default theme;
