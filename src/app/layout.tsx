import type { Metadata } from "next"
import { ReduxProvider } from "@providers/redux-provider"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { Kumbh_Sans } from "next/font/google"
import theme from "@utils/mui-theme"
// import "@radix-ui/themes/styles.css"
import "./globals.css"
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
        {/* <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
        > */}
          {/* <Theme 
            appearance="inherit"
            accentColor="cyan"
            grayColor="slate" 
            radius="full" 
            scaling="100%"
          > */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ReduxProvider>
              <Header />
              {children}
            </ReduxProvider>
          {/* </Theme> */}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
