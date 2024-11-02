"use client"
import Image from "next/image"
import { PageLayout } from "@ui/mui-layout"
import { FlexBox } from "@ui/mui-elements"
import { Typography } from "@mui/material"
import { IconCloud } from "@app/components/about/icon-cloud"


export default function AboutPage() {
  return (
    <PageLayout>
      <FlexBox sx={{
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "start",
        gap: { xs: "4rem", sm: "2rem", lg: "4rem" },
        height: "100%",
        padding: "2rem 1.5rem",
        overflowY: "auto"
      }}>
        <FlexBox sx={{
          minWidth: "20rem",
          maxWidth: "40rem",
          maxHeight: "40rem",
          marginLeft: "auto",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(0, 96, 100, 0.33) 0%, rgba(0, 96, 100, 0) 70%)"
        }}>
          <IconCloud />
        </FlexBox>

        <FlexBox sx={{
          flexDirection: "column",
          alignItems: { xs: "center", sm: "start" },
          justifyContent: "start",
          gap: "2rem",
          height: "100%"
        }}>
          <FlexBox sx={{
            gap: "0.5rem",
            marginTop: "auto"
          }}>
            <Image 
              src={"/images/Llama.webp"}
              alt="Talkabout Logo - a llama"
              width={56}
              height={56}
              className="w-14 h-auto rounded-logo invert dark:invert-0"
            />
            <Typography variant="h1">Talkabout</Typography>
          </FlexBox>

          <FlexBox sx={{ 
            flexDirection: "column", 
            gap: "1rem", 
            marginBottom: "auto",
            paddingBottom: "1rem"
          }}>
            <Typography variant="body2" sx={{ maxWidth: "100ch" }}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quo molestiae alias molestias sequi iste quis numquam minima debitis velit aliquam quas, officiis a delectus dolore veniam vel perferendis odio?
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quo molestiae alias molestias sequi iste quis numquam minima debitis velit aliquam quas, officiis a delectus dolore veniam vel perferendis odio?
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quo molestiae alias molestias sequi iste quis numquam minima debitis velit aliquam quas, officiis a delectus dolore veniam vel perferendis odio?
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: "100ch" }}>
              The world&apos;s mysteries unraveled through the eyes of a llama
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quo molestiae alias molestias sequi iste quis numquam minima debitis velit aliquam quas, officiis a delectus dolore veniam vel perferendis odio?
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quo molestiae alias molestias sequi iste quis numquam minima debitis velit aliquam quas, officiis a delectus dolore veniam vel perferendis odio?
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quo molestiae alias molestias sequi iste quis numquam minima debitis velit aliquam quas, officiis a delectus dolore veniam vel perferendis odio?
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quo molestiae alias molestias sequi iste quis numquam minima debitis velit aliquam quas, officiis a delectus dolore veniam vel perferendis odio?
              </Typography>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </PageLayout>
  )
}
