import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "14px",
                color: "white",
                backgroundColor: "#0052B4"
              },
              arrow:{
                color: "#0052B4"
              }
            }
          }
        }
    });