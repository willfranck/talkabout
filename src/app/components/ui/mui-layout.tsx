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
        padding: 0,
        margin: 0
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
          gap: { xs: "0.75rem", lg: "2rem"},
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          overflowY: "auto",
          overscrollBehavior: "contain",
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
  anchor,
  children
}: {
  open: boolean
  onClose: () => void
  anchor: "top" | "right" | "bottom" | "left"
  children: React.ReactNode
}) => {
  return (
    <Drawer 
      open={open} 
      onClose={onClose}
      variant="temporary"
      component="aside"
      anchor={anchor} 
      elevation={0}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "10rem"
        }
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
