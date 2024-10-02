import type { Metadata } from "next"
import { Kumbh_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import "./globals.css"
import Header from "@header/index"

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
    <html lang="en">
      <body className={`${kumbhSans.variable} antialiased`}>
        <ThemeProvider attribute="class">
          <Theme 
            accentColor="cyan" 
            grayColor="slate" 
            radius="medium" 
            scaling="100%"
          >
            <Header />
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  )
}
