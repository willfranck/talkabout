import { Flex, ScrollArea } from "@radix-ui/themes"

//// Layout Components ////
const PageLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="w-full h-page-content pr-2">
      <ScrollArea
        type="auto"
        scrollbars="vertical"
        size="1"
        className="w-full h-full fade-in"
      >
        <Flex 
          direction="row" 
          align="center" 
          justify="center" 
          gap="8"
          width="100%"
          height="100%"
        >
          {children}
        </Flex>
      </ScrollArea>
    </main>
  )
}

export { 
  PageLayout 
}
