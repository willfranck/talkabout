import { ChatHistory, ChatHistoryMessageProps } from "@ui/radix-elements"


export const ChatArea = () => {
  const sampleMessages = [
    {
      id: 1,
      role: "user",
      content: "Three fundamental aspects of typography are legibility, readability, and aesthetics. Although in a non-technical sense “legible” and “readable” are often used synonymously, typographically they are separate but related concepts.",
      date: new Date(),
    },
    {
      id: 2,
      role: "ai",
      content: "Legibility describes how easily individual characters can be distinguished from one another. It is described by Walter Tracy as “the	quality of being decipherable and recognisable”. For instance, if a “b” and an “h”, or a “3” and an “8”, are difficult to distinguish at small sizes, this is a problem of legibility.",
      date: new Date(),
    },
    {
      id: 3,
      role: "user",
      content: "Typographers are concerned with legibility insofar as it is their job to select the correct font to use. Brush Script is an example of a font containing many characters that might be difficult to distinguish. The selection of cases influences the legibility of typography because using only uppercase letters (all-caps) reduces legibility.",
      date: new Date(),
    },
    {
      id: 4,
      role: "ai",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quis culpa assumenda asperiores explicabo dolor, nostrum, neque sit ratione accusantium facere odit nisi quaerat repellat, quam dolores nihil. Possimus, neque?",
      date: new Date(),
    },
  ] as ChatHistoryMessageProps["messages"]


  return (
    <ChatHistory messages={sampleMessages} />
  )
}
