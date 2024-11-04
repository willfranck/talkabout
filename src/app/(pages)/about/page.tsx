"use client"
import Image from "next/image"
import { PageLayout } from "@ui/mui-layout"
import { FlexBox } from "@ui/mui-elements"
import { Box, Typography } from "@mui/material"
import { IconCloud } from "@app/components/about/icon-cloud"


export default function AboutPage() {
  return (
    <PageLayout>
      <FlexBox sx={{
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "start",
        gap: { xs: "3rem", sm: "2rem", md: "4rem", lg: "8rem" },
        height: "100%",
        padding: "2rem 1.5rem",
        overflowY: "auto"
      }}>
        <FlexBox sx={{ 
          flexDirection: "column", 
          marginY: "auto" 
        }}>
          <FlexBox sx={{ gap: "0.5rem" }}>
            <Image 
              src={"/images/Llama.webp"}
              alt="Talkabout Logo - a llama"
              width={28}
              height={28}
              className="w-7 h-auto rounded-logo invert dark:invert-0"
            />
            <Typography fontSize="1.5rem" fontWeight="bold">Talkabout</Typography>
          </FlexBox>
          <Typography variant="body2">made with love ... also with these technologies...</Typography>
          <FlexBox sx={{
            minWidth: "20rem",
            maxWidth: "40rem",
            maxHeight: "40rem",
            margin: "1rem 0 1rem auto",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(0, 96, 100, 0.33) 0%, rgba(0, 96, 100, 0) 70%)"
          }}>
            <IconCloud />
          </FlexBox>
        </FlexBox>

        <FlexBox sx={{
          flexDirection: "column",
          alignItems: { xs: "center", sm: "start" },
          gap: "2rem",
          marginY: "auto"
        }}>
          <Typography variant="h2" fontWeight="bold">How To</Typography>
          <FlexBox sx={{ 
            flexDirection: "column",
            alignItems: "start", 
            gap: "1rem", 
            paddingBottom: "1rem"
          }}>
            <Box>
              <Typography fontWeight="bold" sx={{ marginBottom: "0.25rem" }}>The Basics</Typography>
              <Typography variant="body2" sx={{ maxWidth: "100ch" }}>
                Talkabout is a straightforward and fun AI Chat app. <br />
                - Llamini Flash is your virtual assistant able to help you learn new things, assist with work or code, or simply mess around. <br />
                - Use the temperature setting in the chat input to your advantage. <br />
                - The default is hot which is great for a fun time.  Switch it to cold for more serious situations. <br />
                - Archiving is available for organization.  Set aside important chats to distinguish them. <br />
                - Deleting a message will delete all messages afterwards in order to redirect the conversation if things go awry.
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold" sx={{ marginBottom: "0.25rem" }}>The Limits</Typography>
              <Typography variant="body2" sx={{ maxWidth: "100ch" }}>
                As the assistant&apos;s name might suggest, the Llama is powered by Google Gemini 1.5 Flash. <br />
                - Flash is a very efficient LLM, though it doesn&apos;t have the depth of training as other models. <br />
                - The first answer may not always be the most accurate.  Similar to other LLMs, you may need follow up messages to really point it in the right direction. <br />
                - The more context an LLM has, the more accurate the responses.
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold" sx={{ marginBottom: "0.25rem" }}>The Ethics</Typography>
              <Typography variant="body2" sx={{ maxWidth: "100ch" }}>
                In Trial Mode, chats are stored only as long as you remain on the site.  Refreshing any page will delete chats. <br />
                - Should you choose to make an account, chats are saved in a secure storage and not distributed or sold to anyone. <br />
                - Google can save messages up to 30 days for training purposes, so please avoid sending sensitive information for now. <br />
                - I will be updating the app to opt out of Google&apos;s storage in the future
              </Typography>
            </Box>
            <Box width="100%">
              <Typography fontWeight="bold" sx={{ marginBottom: "0.25rem" }}>The Fun</Typography>
              <Typography variant="body2" sx={{ maxWidth: "100ch" }}>
                Most AI Chats are boring.  This is an exercise to spice it up and create something unique. <br />
                - The goal is to still be helpful, but also have fun in the meantime. <br />
                - Have it help you with your homework, some code, or learning about a new topic... <br />
                or simply troll it, have it roast you, talk smack. <br />
              </Typography>
              <Typography 
                variant="body2"
                textAlign="center" 
                color="primary.light"
                sx={{ 
                  maxWidth: "100ch", 
                  marginTop: "1rem"
                }}
              >
                Most of all... Enjoy!
              </Typography>
            </Box>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </PageLayout>
  )
}
