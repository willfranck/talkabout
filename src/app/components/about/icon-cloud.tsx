import { useState, useEffect } from "react"
import { Cloud, renderSimpleIcon, fetchSimpleIcons, type SimpleIcon, type ICloud } from "react-icon-cloud"
import { Box } from "@mui/material"


interface IconsState {
  simpleIcons: Record<string, SimpleIcon>
}

const cloudConfig = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      maxWidth: "30rem",
    }
  },
  options: {
    initial: [0.15, -0.05],
    fadeIn: 1200,
    maxSpeed: 0.005,
    depth: 0.33,
    imageScale: 4,
    noMouse: true,
    wheelZoom: false,
    pinchZoom: false,
    outlineMethod: "none" as const,
  }
}

const ICON_SLUGS = [
  "nextdotjs",
  "mui",
  "react",
  "typescript",
  "redux",
  "googlegemini",
  "tailwindcss",
  "nodedotjs",
  "vercel",
  "electron",
  "github",
  "remark",
  "html5",
  "css3",
  "supabase"
]

const useIcons = (slugs: string[]) => {
  const [icons, setIcons] = useState<IconsState | null>(null)
  
  useEffect(() => {
    const loadIcons = async () => {
      try {
        const fetchedIcons = await fetchSimpleIcons({ slugs })
        if (fetchedIcons.simpleIcons) {
          // Icons are all now returning with hex prop of #000 - temporary single color fix
          // ["nextdotjs", "github", "remark"].forEach((slug) => {
          Object.keys(fetchedIcons.simpleIcons).forEach((slug) => {
            if (fetchedIcons.simpleIcons[slug]) {
              fetchedIcons.simpleIcons[slug].hex = "#26C6DA"
            }
          })
        }
        setIcons(fetchedIcons)

      } catch (error) {
        console.error('Error fetching icons:', error)
      }
    }
    loadIcons()
  }, [slugs])

  if (!icons) {
    return <Box>Loading...</Box>
  }

  return Object.values(icons.simpleIcons).map((icon, index) => {
    const iconElement = renderSimpleIcon({
      icon,
      size: 42,
      aProps: {
        onClick: (e: React.MouseEvent) => e.preventDefault()
      }
    })
    return (
      <Box key={`${icon.title}-${index}`}>
        {iconElement}
      </Box>
    )
  })
}


const IconCloud = () => {
  const icons = useIcons(ICON_SLUGS)
  
  const cloudProps: ICloud = {
    ...cloudConfig,
    children: [...(Array.isArray(icons) ? icons : [icons])]
  }
  
  return (
    <Cloud {...cloudProps} />
  )
}


export {
  IconCloud
}
