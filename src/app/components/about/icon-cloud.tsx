import { useState, useEffect } from "react"
import { Cloud, renderSimpleIcon, fetchSimpleIcons, type SimpleIcon, type ICloud } from "react-icon-cloud"
import { Box } from "@mui/material"


interface IconsState {
  simpleIcons: Record<string, SimpleIcon>;
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
    dragControl: true,
    dragThreshold: 4,
    initial: [0.15, -0.05],
    fadeIn: 1200,
    maxSpeed: 0.01,
    clickToFront: 500,
    depth: 0.33,
    imageScale: 4,
    tooltip: "native" as const,
    tooltipDelay: 0,
    noMouse: false,
    wheelZoom: false,
    pinchZoom: false,
    noSelect: false,
    freezeActive: false,
    freezeDecel: true,
    outlineMethod: "none" as const,
  }
}

const ICON_SLUGS = [
  "nextdotjs",
  "mui",
  "react",
  "typescript",
  "vercel",
  "tailwindcss",
  "nodedotjs",
  "electron",
  "remark",
  "github",
  "html5",
  "css3",
  "supabase"
]

const ICON_COLOR: Record<string, string> = {
  nextdotjs: "#EDEDED"
}

const useIcons = (slugs: string[]) => {
  const [icons, setIcons] = useState<IconsState | null>(null)
  
  useEffect(() => {
    const loadIcons = async () => {
      try {
        const fetchedIcons = await fetchSimpleIcons({ slugs })
        if (fetchedIcons.simpleIcons) {
          ["nextdotjs", "github", "remark"].forEach((slug) => {
            if (fetchedIcons.simpleIcons[slug]) {
              fetchedIcons.simpleIcons[slug].hex = "#EDEDED";
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

  return Object.values(icons.simpleIcons).map((icon) => (
    renderSimpleIcon({
      icon,
      size: 42,
      bgHex: ICON_COLOR[icon.hex],
      aProps: {
        onClick: (e: React.MouseEvent) => e.preventDefault()
      }
    })
  ))
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
