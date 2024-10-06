import Link from "next/link"
import { 
  Flex,
  Box, 
  Card, 
  Heading,  
  TabNav, 
  SegmentedControl, 
  ScrollArea, 
  Dialog, 
  DropdownMenu, 
  Button, 
  Text, 
  TextArea, 
  TextField, 
  Progress, 
  Badge
} from "@radix-ui/themes"
import { 
  CaretCircleRight,
  GoogleLogo, 
  UserCircle
} from "@phosphor-icons/react/dist/ssr"


//// Control Components ////
interface LinkProps {
  name: string,
  path: string,
  active?: boolean,
}

const Nav = ({
  links
}: {
  links: LinkProps[]
}) => {
  const linkElements = links.map((link) => (
    <TabNav.Link 
      key={link.path} 
      active={link.active}
      asChild
    >
      <Link href={link.path}>
        {link.name}
      </Link>
    </TabNav.Link>
  ))
  
  return (
    <TabNav.Root
      size="2"
      className="shadow-none"
    >
      {linkElements}
    </TabNav.Root>
  )
}


interface DropdownProps {
  trigger: string,
}

const Dropdown = ({
  trigger
}: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" className="h-8 px-4 sm:px-5">
          {trigger}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut={process.platform === "darwin" ? "⌘ E" : "^ E"}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item shortcut={process.platform === "darwin" ? "⌘ D" : "^ D"}>
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        
        <DropdownMenu.Item shortcut={process.platform === "darwin" ? "⌘ N" : "^ N"}>
          Archive
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
            <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

            <DropdownMenu.Separator />
            <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />

        <DropdownMenu.Item>Share</DropdownMenu.Item>
        <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item 
          shortcut={process.platform === "darwin" ? "⌘ ⌫" : "^ ⌫"}
          color="red"
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}


interface SCProps {
  values: string[],
}

const SegmentedController = ({
  values
}: SCProps) => {
  const controlElements = values.map((value) => (
    <SegmentedControl.Item 
      key={value} 
      value={value}
      className="capitalize"
    >
      {value}
    </SegmentedControl.Item>
  ))

  return (
    <SegmentedControl.Root 
      defaultValue={values[0]} 
      variant="surface"
      className="h-8 p-0.5"
    >
      {controlElements}
    </SegmentedControl.Root>
  )
}

//// Content Components ////
interface ScrollableArticleProps {
  elementType: "div" | "p" | "span" | "label",
  heading?: string,
  text: string | string[],
}

const ScrollableArticle = ({
  elementType,
  heading,
  text
}: ScrollableArticleProps) => {
  const textElements = Array.isArray(text) ? 
    text.map((txt, index) => (
      <Text key={index} as={elementType}>
        {txt}
      </Text>
    )) : (
      <Text as={elementType}>
        {text}
      </Text>
    )

  return (
    <ScrollArea 
      type="auto" 
      scrollbars="vertical"
      className="p-2"
    >
      <Box p="2" pr="6">
        <Heading size="4" mb="4" trim="start">
          {heading}
        </Heading>
        <Flex direction="column" gap="4">
          {textElements}
        </Flex>
      </Box>
    </ScrollArea>
  )
}


interface ModalProps {
  trigger: string,
  title: string,
  description: string,
}

const Modal = ({
  trigger,
  title,
  description 
}: ModalProps) => {
  return (    
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="h-8 px-4 sm:px-5">{trigger}</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="24rem" size="4">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {description}
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" mx="2" weight="bold">
              Name
            </Text>
            <TextField.Root
              defaultValue="Freja Johnsen"
              placeholder="Enter your full name"
              className="px-2"
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" mx="2" weight="bold">
              Email
            </Text>
            <TextField.Root
              defaultValue="freja@example.com"
              placeholder="Enter your email"
              className="px-2"
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}


interface ChatHistoryTabProps {
  chat: {
    id: number,
    title: string,
    date: Date,
    active: boolean
  }[]
}

const ChatHistoryTabs = ({
  chat,
}: ChatHistoryTabProps) => {
  return (
    <Flex direction="column" gap="2" px="4" width="100%">
      {chat.map((chat) => (
        <Card 
          key={chat.id} 
          variant="surface" 
          className={`group flex items-center justify-between hover:bg-gray-700 ${chat.active ? "bg-gray-600" : ""}`}
        >
          <Flex direction="column" gap="1" pr="2">
            <Heading size="2" trim="start" className="line-clamp-1">
              {chat.title}
            </Heading>
            <Text as="span" size="1">
              {chat.date.toLocaleDateString()}
            </Text>
          </Flex>
          <CaretCircleRight size={24} className={`opacity-0 group-hover:opacity-100 ${chat.active ? "opacity-100 text-[#EDEDED]" : ""}`} />
        </Card>
      ))}
    </Flex>
  )
}

export interface ChatHistoryMessageProps {
  messages: {
    id: number,
    role: "user" | "ai",
    content: string,
    date: Date,
  }[]
}

const ChatHistory = ({
  messages
}: ChatHistoryMessageProps) => {
  return (
    <ScrollArea 
      type="hover"
      scrollbars="vertical"
      className="flex-1 pr-12 pl-4"
    >
      <Flex direction="column" gap="6" pt="6">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            variant="surface" 
            className={`max-w-[78%] bg-gray-600/20 ${message.role === "user" ? "self-end text-right bg-gray-800/20" : ""}`}
          >
            <Flex gap="4" align="start">
              {message.role === "ai" && (
                <GoogleLogo size={24} weight="fill" className="text-gray-400" />
              )}
              <Box>
                <Text as="p" size="3" className="">
                {message.content}
                </Text>
                <Text as="span" size="1">
                  {message.date.toLocaleDateString()}
                </Text>
              </Box>
              {message.role === "user" && (
                <UserCircle size={24} weight="duotone" className="text-gray-400" />
              )}
            </Flex>
          </Card>
        ))}
      </Flex>
    </ScrollArea>
  )
}

const ChatInputField = () => {
  return (
    <TextArea 
      variant="surface"
      size="3"
      placeholder="Enter your message"
      tabIndex={1}
      className="h-36 mt-auto mr-8 mb-4"
    />
  )
}

//// Utility Components ////
interface ProgressProps {
  progress: number,
}

const ProgressBar = ({
  progress
}: ProgressProps) => {
  return (
    <Box width="100%" maxWidth="24rem">
      <Progress 
        variant="soft" 
        size="2"
        value={progress}
      ></Progress>
    </Box>
  )
}


interface BadgeProps {
  color: "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky",
  label: string,
}

const BadgeX = ({
  color,
  label
}: BadgeProps) => {
  return (
    <Badge 
      variant="soft"
      radius="medium" 
      color={color}
    >
      {label}
    </Badge>
  )
}


export { 
  Nav, 
  SegmentedController, 
  ScrollableArticle,
  Modal, 
  Dropdown, 
  ChatHistoryTabs, 
  ChatHistory, 
  ChatInputField, 
  ProgressBar, 
  BadgeX,
}
