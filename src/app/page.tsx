import Link from "next/link"
import Image from "next/image"
import { PageLayout} from "@ui/radix-layout"
import { 
  Flex,
  Box, 
  Heading, 
  Text, 
  Button 
} from "@radix-ui/themes"
import { 
  AppleLogo, 
  ArrowRight, 
  WindowsLogo 
} from "@phosphor-icons/react/dist/ssr"


export default function Home() {
  return (
    <PageLayout>
      <Box className="flex flex-col items-center justify-around gap-32">
        <Flex direction="column" align="center" gap="4">
          <Image 
            src={"/images/Llama.webp"}
            alt="Talkabout Logo - a llama"
            width={176}
            height={176}
            className="w-44 h-auto rounded-logo invert dark:invert-0"
          />
          <Heading
            as="h1"
            size="8"
            weight="medium"
          >
            Talkabout
          </Heading>
        </Flex>

        <Text as="span">The world's mysteries unraveled through the eyes of a llama</Text>

        <Flex direction="column" align="center" gap="8">
          <Link href={"/chat"}>
            <Button variant="ghost" className="group flex gap-2 px-6">
              <Text as="p">Try it now</Text>
              <ArrowRight size={18} className="group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Flex direction="row" gap="4">
            <Button variant="surface" size="2" className="flex-1 w-56">
              <AppleLogo size={24} weight="fill" />
              <Text as="span" size="2">Download for Mac</Text>
            </Button>
            <Button variant="surface" size="2" className="flex-1 w-56">
              <WindowsLogo size={24} weight="fill" />
              <Text as="span" size="2">Download for Windows</Text>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </PageLayout>
  )
}
