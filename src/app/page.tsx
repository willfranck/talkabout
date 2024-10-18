import Link from "next/link"
import Image from "next/image"
import { PageLayout} from "@ui/mui-layout"
import { 
  Box, 
  Typography, 
  Button
} from "@mui/material"
import { 
  AppleLogo, 
  ArrowRight, 
  WindowsLogo 
} from "@phosphor-icons/react/dist/ssr"


export default function Home() {
  return (
    <PageLayout>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: { xs: "6rem", md: "8rem" },
        marginX: "2rem"
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <Image 
            src={"/images/Llama.webp"}
            alt="Talkabout Logo - a llama"
            width={176}
            height={176}
            className="w-36 md:w-44 h-auto rounded-logo invert dark:invert-0"
          />
          <Typography variant="h1">Talkabout</Typography>
        </Box>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          The world&apos;s mysteries unraveled through the eyes of a llama
        </Typography>

        <Box className="gap-8" sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <Link href={"/chat"}>
            <Button variant="text" sx={{
              display: "flex",
              gap: "0.5rem",
              paddingX: "1.5rem",
              borderRadius: "9999px",
              textTransform: "none"  
            }}>
              <Typography variant="body1">Try it now</Typography>
              <ArrowRight size={18} className="group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: "1rem"
          }}>
            <Button variant="outlined" sx={{
              width: "16rem",
              borderRadius: "9999px",
              textTransform: "none"
            }}>
              <AppleLogo size={24} weight="fill" className="mr-2" />
              <Typography variant="body2">Download for Mac</Typography>
            </Button>
            <Button variant="outlined" sx={{
              width: "16rem",
              borderRadius: "9999px",
              textTransform: "none"
            }}>
              <WindowsLogo size={24} weight="fill" className="mr-2" />
              <Typography variant="body2">Download for Windows</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </PageLayout>
  )
}
