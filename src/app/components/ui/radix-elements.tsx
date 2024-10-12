import { cn } from "@utils/clsx"
import Link from "next/link"
import { AppDispatch } from "@redux/store"
import { useAppDispatch } from "@redux/hooks"
import { 
  Flex,
  Box, 
  TabNav, 
  SegmentedControl, 
  Dialog, 
  Button, 
  Text, 
  TextField, 
  Progress, 
  Badge
} from "@radix-ui/themes"
import { 
  Trash,
  ArrowDown, 
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

interface DeleteButtonProps {
  action: (dispatch: AppDispatch, id: string) => void
  itemId: string
  buttonLocation: "chat-history" | "threads"
}

const DeleteButton = ({
  action,
  itemId,
  buttonLocation
}: DeleteButtonProps) => {
  const dispatch = useAppDispatch()

  return (
    <Button 
      variant="soft"
      onClick={() => action(dispatch, itemId)}
      tabIndex={-1}
      className="absolute top-0 right-0 flex flex-col h-full opacity-0 group-hover:opacity-100 rounded-right-only bg-red-500 hover:bg-red-600"
    >
      <Trash size={22} className={cn({"mt-1.5": buttonLocation === "chat-history"})} />
      {buttonLocation === "chat-history" && (
        <ArrowDown size={20} />
      )}
    </Button>
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
  Modal, 
  DeleteButton, 
  ProgressBar, 
  BadgeX,
}
