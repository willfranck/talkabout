import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Kumbh_Sans } from "next/font/google"
import Header from "@/components/Header"

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Talkabout",
  description: "AI Powered NextJS Electron App",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
    >
      <body 
        className={`${kumbhSans.variable} antialiased`}
      >
        <ThemeProvider enableSystem={true} defaultTheme="system" attribute="class">
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
