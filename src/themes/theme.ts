import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#242424",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '20px',
      color: "#FF3400",
    },
    h4: {
      fontWeight: 600,
      color: "#1976d2",
    },
  },
});

