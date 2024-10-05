import { Flex, ScrollArea } from "@radix-ui/themes"


const PageLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="w-full h-[calc(100vh-4rem)] px-2 pb-2">
      <ScrollArea
        type="auto"
        scrollbars="vertical"
        className="w-full h-full"
      >
        <Flex 
          direction="row" 
          align="center" 
          justify="center" 
          gap="8"
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
