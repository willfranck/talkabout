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
  description: "AI Powered NextJS Electron App",
  keywords: "AI, Chat, Productivity, Application, NextJS, Electron",
  robots: "index, follow",
  openGraph: {
    title: "Talkabout",
    description: "AI Powered NextJS Electron App",
    url: "https://talkabout.vercel.app",
    images: "https://talkabout.vercel.app/image.png",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talkabout",
    description: "AI Powered NextJS Electron App",
    images: "https://talkabout.vercel.app/image.png",
  },
}

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
