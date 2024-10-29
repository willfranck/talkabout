import type { Metadata } from "next"
import { ReduxProvider } from "@providers/redux-provider"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { SnackbarProvider } from "@providers/mui-snackbar-provider"
import { Kumbh_Sans } from "next/font/google"
import theme from "@utils/mui-theme"
import "./globals.css"
import "highlight.js/styles/hybrid.css"
import Header from "@header/index"


export const metadata: Metadata = {
  title: "Talkabout",
  description: "AI Chat with Llamini-Flash - A llama powered by Google Gemini",
  keywords: "AI, Chat, Productivity, Application, NextJS, Electron",
  robots: "index, follow",
}

const kumbhSans = Kumbh_Sans({
  variable: "--font-kumbh-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kumbhSans.variable}`}>
        <ReduxProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider>
                <Header />
                {children}
              </SnackbarProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
