import { 
  Container, 
  Box, 
  Drawer 
} from "@mui/material"

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
          gap: { xs: "1rem", lg: "2rem"},
          width: "100%",
          height: "100%",
          opacity: "0",
          animation: "fadeIn 240ms ease-out forwards"
        }}
      >
        {children}
      </Box>
    </Container>
  )
}

const MobileDrawer = ({
  open,
  onClose,
  children
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  return (
    <Drawer 
      open={open} 
      onClose={onClose}
      variant="temporary"
      component="aside"
      anchor="left" 
      elevation={0}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        display: { xs: "flex", md: "none" }
      }}
    >
      {children}
    </Drawer>
  )
}


export { 
  PageLayout,
  MobileDrawer
}
