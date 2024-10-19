import { Container, Box } from "@mui/material"

//// Layout Elements
const PageLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Container 
      component="main" 
      sx={{ 
        padding: { xs: "0" }
      }} 
      className="h-page-content"
    >
      <Box 
        component="section" 
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </Box>
    </Container>
  )
}

export { 
  PageLayout 
}
