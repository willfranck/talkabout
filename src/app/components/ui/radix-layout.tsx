import { Flex, ScrollArea } from "@radix-ui/themes"

//// Layout Elements
const PageLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="w-full h-page-content">
      <Flex 
        direction={{ initial: "column", sm: "row"}} 
        align="center" 
        justify="center" 
        gap="8"
        width="100%"
        height="100%"
      >
        {children}
      </Flex>
    </main>
  )
}

export { 
  PageLayout 
}
