import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "12px",
                color: "white",
                backgroundColor: "var(--tooltip)"
              },
              arrow:{
                color: "var(--tooltip)"
              }
            }
          }
        }
    });