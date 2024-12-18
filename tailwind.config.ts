import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "600px",
        md: "964px",
        lg: "1200px"
      },
      backgroundImage: {
        "llama-banner": "url('/images/Llama_Banner.webp')"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      height: {
        "page-content": "calc(100vh - 3.5rem)",
      },
      maxHeight: {
        "page-content": "calc(100vh - 3.5rem)",
      },
    },
  },
  plugins: [],
}

export default config
