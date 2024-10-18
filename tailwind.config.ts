import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      height: {
        "page-content": "calc(100vh - 4.3rem)",
      },
      maxHeight: {
        "page-content": "calc(100vh - 4.3rem)",
      },
    },
  },
  plugins: [],
}

export default config
