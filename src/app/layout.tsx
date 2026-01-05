import type { Metadata, Viewport } from "next"
import { ReduxProvider } from "@providers/redux-provider"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { SnackbarProvider } from "@providers/mui-snackbar-provider"
import { SupabaseSessionProvider } from "@providers/session-provider"
import { createClient } from "@utils/supabase/server"
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

export const viewport: Viewport = {
  viewportFit: "cover"
}

const kumbhSans = Kumbh_Sans({
  variable: "--font-kumbh-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let session = null
  
  try {
    const supabase = createClient()
    const { data, error } = await (await supabase).auth.getSession()

    if (!error) {
      session = data.session
    }

  } catch (error) {
    console.log("Supabase can't be reached: ", error)
  }


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kumbhSans.variable}`}>
        <ReduxProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider>
                <SupabaseSessionProvider initialSession={session}>
                  <Header />
                  {children}
                </SupabaseSessionProvider>
              </SnackbarProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
