"use client"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "@hooks/global"
import { PageLayout } from "@ui/mui-layout"
import { FlexBox } from "@ui/mui-elements"
import { 
  Typography, 
  Button
} from "@mui/material"
import { 
  ArrowRight, 
  SignIn,
  // AppleLogo, 
  // WindowsLogo 
} from "@phosphor-icons/react/dist/ssr"


export default function Home() {
  const { session } = useSession()
  // const isMobileOS = useIsMobileOS()

  return (
    <PageLayout>
      <FlexBox sx={{
        flexDirection: "column",
        gap: { xs: "4rem", md: "6rem", lg: "8rem" },
        margin: "auto 2rem",
        paddingY: "1rem"
      }}>
        <FlexBox sx={{
          flexDirection: "column",
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
        </FlexBox>

        <FlexBox sx={{ flexDirection: "column" }}>
          <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "bold" }}>
            An AI Chat Experience
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            The world&apos;s mysteries unraveled through the eyes of a llama
          </Typography>
        </FlexBox>

        <FlexBox sx={{
          flexDirection: "column",
          gap: "2rem",
        }}>
          <FlexBox sx={{ 
            flexDirection: "column", 
            gap: "1rem",
            minHeight: "5.5rem" 
          }}>
            <Link href={"/chat"}>
              <Button 
                variant="text" 
                sx={{
                  gap: "0.5rem",
                  paddingX: "1.5rem"
                }}
                className="group"
              >
                <Typography variant="body1" sx={{ textWrap: "nowrap"}}>
                  {!session ? "Try it now" : "Start Chatting"}
                </Typography>
                <ArrowRight size={18} className="group-hover:translate-x-0.5" />
              </Button>
            </Link>
            {!session && (
              <Link href={"/auth"}>
                <Button 
                  variant="text" 
                  sx={{
                    gap: "0.5rem",
                    paddingX: "1.5rem"
                  }}
                  className="group"
                >
                  <Typography variant="body1" sx={{ textWrap: "nowrap"}}>Sign In/Up</Typography>
                  <SignIn size={18} className="group-hover:translate-x-0.5" />
                </Button>
              </Link>
            )}
          </FlexBox>
          {/* {!isMobileOS && (
            <FlexBox sx={{
              flexDirection: { xs: "column", sm: "row" },
              gap: "1rem"
            }}>
              <Button 
                variant="outlined" 
                sx={{
                  width: "16rem",
                  borderRadius: "9999px",
                  textTransform: "none"
                }}
              >
                <AppleLogo size={24} weight="fill" className="mr-2" />
                <Typography 
                  variant="body2" 
                  color="primary.main"
                >
                  Download for Mac
                </Typography>
              </Button>
              <Button 
                variant="outlined" 
                sx={{
                  width: "16rem",
                  borderRadius: "9999px",
                  textTransform: "none"
                }}
              >
                <WindowsLogo size={24} weight="fill" className="mr-2" />
                <Typography 
                  variant="body2" 
                  color="primary.main"
                >
                  Download for Windows
                </Typography>
              </Button>
            </FlexBox>
          )} */}
        </FlexBox>
      </FlexBox>
    </PageLayout>
  )
}
