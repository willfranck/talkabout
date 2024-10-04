"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Flex,
  Box, 
  TabNav, 
  SegmentedControl, 
  Dialog, 
  DropdownMenu, 
  Button, 
  Text, 
  TextField, 
  Progress, 
  Badge
} from "@radix-ui/themes"


const Nav = ({
  links,
}: {
  links: {
    linkName: string
    linkAddress: string
  }[]
}) => {
  const pathname = usePathname()
  const linkElements = links.map((link, index) => (
    <TabNav.Link 
      key={index} 
      active={pathname === link.linkAddress}
      asChild
    >
      <Link href={link.linkAddress}>
        {link.linkName}
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

const SegmentedController = ({
  values
}: {
  values: string[]
}) => {
  const controlElements = values.map((value, index) => (
    <SegmentedControl.Item 
      key={index} 
      value={value}
      className="capitalize"
    >
      {value}
    </SegmentedControl.Item>
  ))

  return (
    <SegmentedControl.Root 
      defaultValue={values[0]} 
      className="h-8 p-0.5"
    >
      {controlElements}
    </SegmentedControl.Root>
  )
}

const Modal = ({
  trigger,
  title,
  description, 
}: {
  trigger: string
  title: string
  description: string
}) => {
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

const Dropdown = ({
  trigger,
}: {
  trigger: string
}) => {
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

const ProgressBar = () => {
  const [percentLoaded, setPercentLoaded] = useState(0)

  const fakeLoading = () => {
    let progress = 0
    while (progress < 100) {
      progress += (1 - Math.random())
      setPercentLoaded(progress)
    }
  }

  useEffect(() => {
    fakeLoading()
  }, []);

  return (
    <Box width="100%" maxWidth="24rem">
      <Progress 
        variant="soft" 
        size="2"
        value={percentLoaded}
      ></Progress>
    </Box>
  )
}

const BadgeX = ({
  color,
  label,
}: {
  color: "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky"
  label: string
}) => {
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
  Modal, 
  Dropdown, 
  ProgressBar, 
  BadgeX
}