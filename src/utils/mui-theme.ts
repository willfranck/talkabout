"use client"
import { createTheme, alpha } from "@mui/material/styles"
import { grey, cyan } from "@mui/material/colors"


const theme = createTheme({
  //// MUI Palette
  palette: {
    mode: 'dark',
    primary: {
      main: cyan[700],
      dark: cyan[900],
      light: cyan[400],
      contrastText: cyan[200],
    },
    secondary: {
      main: grey[600],
      dark: grey[900],
      light: grey[300],
      contrastText: grey[50],
    },
    background: {
      default: "#101010",
      paper: "181818",
    },
    divider: '#37474F',
  },
  //// MUI Typography
  typography: (palette) => ({
    fontFamily: "var(--font-kumbh-sans)",
    h1: {
      fontSize: '2.2rem',
      fontWeight: 600,
      color: palette.secondary.light,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: palette.primary.light,
    },
    body1: {
      fontSize: '0.95rem',
      color: palette.secondary.light,
      whiteSpace: "pre-wrap",
    },
    body2: {
      fontSize: '0.85rem',
      color: palette.secondary.main,
    },
  }),
  //// MUI Components
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
        root: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.dark,
          borderRadius: "10px",
        })
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.secondary.dark, 0.3),
          borderRadius: "0.5rem",
        })
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
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.secondary.dark,
          textTransform: "none",
          borderRadius: "9999px",
          "&:hover": {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.primary.dark,
          },
          "&.Mui-selected": {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              color: theme.palette.secondary.light,
              backgroundColor: theme.palette.primary.main,
            }
          }
        })
      }
    }
  }
})

export default theme
