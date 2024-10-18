"use client"
import { createTheme } from "@mui/material/styles"
import { cyan } from "@mui/material/colors"

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: cyan[500],
    },
    secondary: {
      main: cyan[300],
    },
    background: {
      default: "#121212",
      paper: '#161616',
    },
    text: {
      primary: '#EFEFEF',
      secondary: '#B0BEC5',
    },
    divider: '#37474F',
  },
  typography: {
    fontFamily: "var(--font-kumbh-sans)",
    h1: {
      fontSize: '2.2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      color: '#EFEFEF',
      whiteSpace: "pre-wrap",
    },
    body2: {
      fontSize: '0.875rem',
      color: '#8A8A8A',
    },
  },
  
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.up("xl")]: {
            maxWidth: "2400px",
          }
        })
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          backgroundColor: "#0A0A0AAA",
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "0",
          textTransform: "none",
          borderRadius: "9999px",
        }
      }
    },
    MuiToggleButton: {
      defaultProps: {
        tabIndex: 0,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "9999px"
        },
        selected: {
          color: "I want the secondary color here",
        }
      }
    },
  },
})

export default theme
