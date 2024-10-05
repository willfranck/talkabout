import { Flex, ScrollArea } from "@radix-ui/themes"


const PageLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="w-full h-[calc(100vh-4rem)] px-2 pb-1">
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
