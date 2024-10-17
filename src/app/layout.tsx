import type { Metadata } from "next"
import { ReduxProvider } from "@providers/redux-provider"
import { ThemeProvider } from "next-themes"
import { Theme } from "@radix-ui/themes"
import { Kumbh_Sans } from "next/font/google"
import "@radix-ui/themes/styles.css"
import "./globals.css"
import Header from "@header/index"


export const metadata: Metadata = {
  title: "Talkabout",
  description: "AI Chat with Llamini-Flash - A llama powered by Google Gemini",
  keywords: "AI, Chat, Productivity, Application, NextJS, Electron",
  robots: "index, follow",
}

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
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
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Theme 
            appearance="inherit"
            accentColor="cyan"
            grayColor="slate" 
            radius="full" 
            scaling="100%"
          >
            <ReduxProvider>
              <Header />
              {children}
            </ReduxProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  )
}
