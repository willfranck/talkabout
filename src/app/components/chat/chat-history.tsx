import { SegmentedController } from "@ui/radix-elements"


export const ChatHistory = () => {
  return (
    <aside className="flex flex-col items-end justify-center w-64 h-full gap-8 p-4">
      <SegmentedController values={["Chats", "Settings"]} />
      <div className="flex flex-col text-end">
        <span>Build an application</span>
        <span>Ideas for new project</span>
        <span>How to bake a cake</span>
        <span>Does my dog really love me?</span>
      </div>
    </aside>
  )
}
