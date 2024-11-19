"use client"
import Link from "next/link"
import { PageLayout } from "@ui/mui-layout"
import { FlexBox } from "@ui/mui-elements"
import { 
  alpha, 
  useMediaQuery, 
  Typography, 
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider 
} from "@mui/material"
import theme from "@utils/mui-theme"
import { IconCloud } from "@about/icon-cloud"
import { content } from "@about/about-content"
import { 
  CaretCircleUp, 
  LinkedinLogo,
  GithubLogo
 } from "@phosphor-icons/react/dist/ssr"


export default function AboutPage() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const ListBlock = ({
    subheader,
    listItemContent
  }: {
    subheader: string
    listItemContent: string[]
  }) => {
    const listElements = listItemContent.map((itemContent, index) => {
      return (
        <ListItem key={index} sx={{  }}>
          <Typography 
            variant="body2" 
            sx={{ 
              display: "inline", 
              maxWidth: "100ch" 
            }}
          >
            {itemContent}
          </Typography>
        </ListItem>
      )
    })

    return (
      <List dense sx={{ 
        width: "100%",
        "& .MuiListItem-root": {
          paddingX: "2rem"
        } 
      }}>
        <ListSubheader 
          component="div" 
          sx={{ 
            backgroundColor: alpha("#141414", 0.5), 
            backdropFilter: "blur(5px)" 
          }}
        >
          <Typography fontWeight="bold" sx={{ padding: "0.25rem 0.5rem" }}>
            {subheader}
          </Typography>
        </ListSubheader>

        {listElements}
      </List>
    )
  }

  return (
    <PageLayout>
      <FlexBox sx={{
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "start",
        width: "100%",
        height: "100%"
      }}>
        <FlexBox sx={{ 
          flexGrow: "1",
          flexDirection: "column",
          width: { xs: "100%", sm: "auto" },
          height: { xs: "auto", sm: "100%" }, 
          marginY: "auto",
          padding: "1rem",
          backgroundColor: alpha(theme.palette.primary.dark, 0.08),
        }}>
          <FlexBox sx={{
            width: { xs: "14rem", sm: "20rem", md: "24rem", lg: "30rem" },
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(0, 96, 100, 0.4) 0%, rgba(0, 96, 100, 0) 66%)"
          }}>
            <IconCloud />
          </FlexBox>
          <FlexBox sx={{ 
            gap: "0.25rem",
            marginBottom: "1rem" 
          }}>
            <Typography variant="body2">
              made with love ... also with these technologies
            </Typography>
            <CaretCircleUp size={18} color={theme.palette.secondary.main} />
          </FlexBox>
        </FlexBox>

        <Divider 
          orientation={isSmallScreen ? "horizontal" : "vertical"} 
          sx={{ 
            width: (isSmallScreen ? "100%" : "auto"),
            height: (isSmallScreen ? "auto" : "100%"),
            opacity: "20%" 
          }}
          flexItem 
        />

        <FlexBox sx={{
          flexGrow: "2",
          flexDirection: "column",
          justifyContent: "start",
          height: "100%",
          overflowY: "auto"
        }}>
          <FlexBox sx={{
            flexDirection: "column",
            gap: "2rem",
            marginY: "auto",
            paddingY: "4rem"
          }}>
            <Typography variant="h2" fontWeight="bold">
              How To
            </Typography>
            <FlexBox sx={{ 
              flexDirection: "column",
              alignItems: "start", 
              gap: "1rem"
            }}>
              <ListBlock subheader={content.sections.basics.header} listItemContent={content.sections.basics.content} />
              <ListBlock subheader={content.sections.limits.header} listItemContent={content.sections.limits.content} />
              <ListBlock subheader={content.sections.ethics.header} listItemContent={content.sections.ethics.content} />
              <ListBlock subheader={content.sections.fun.header} listItemContent={content.sections.fun.content} />
              
              <Typography 
                color="primary.light"
                textAlign="center" 
                fontWeight="600"
                sx={{ 
                  width: "100%", 
                  marginTop: "1rem"
                }}
              >
                Most of all... Enjoy!
              </Typography>
            </FlexBox>
          </FlexBox>

          <FlexBox sx={{ 
            flexDirection: "column", 
            gap: "0.5rem",
            width: "100%",
            paddingY: "1rem",
            borderTop: "2px solid",
            borderColor: alpha(theme.palette.primary.dark, 0.2)
          }}>
            <Typography variant="body2">@willfranckcodes</Typography>
            <FlexBox>
              <List dense sx={{ display: "flex" }}>
                <ListItemButton
                  LinkComponent={Link}
                  href="https://www.linkedin.com/in/william-franck/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile page"
                >
                  <ListItemIcon sx={{ minWidth: "1.875rem" }}>
                    <LinkedinLogo size={24} />
                  </ListItemIcon>
                  <ListItemText primary="LinkedIn" />
                </ListItemButton>
                <ListItemButton
                  LinkComponent={Link}
                  href="https://github.com/willfranck"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile page"
                >
                  <ListItemIcon sx={{ minWidth: "1.875rem" }}>
                    <GithubLogo size={24} />
                  </ListItemIcon>
                  <ListItemText primary="GitHub" />
                </ListItemButton>
              </List>
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </PageLayout>
  )
}
