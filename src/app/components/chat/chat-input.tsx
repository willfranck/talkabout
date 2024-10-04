import { ScrollableArea } from "@ui/radix-elements"


export const ChatInput = () => {
  const sampleHeading = "Principles of the typographic craft"
  const sampleText = [
      "Three fundamental aspects of typography are legibility, readability, and aesthetics. Although in a non-technical sense “legible” and “readable” are often used synonymously, typographically they are separate but related concepts.",
      "Legibility describes how easily individual characters can be distinguished from one another. It is described by Walter Tracy as “the	quality of being decipherable and recognisable”. For instance, if a “b”	and an “h”, or a “3” and an “8”, are difficult to distinguish at small sizes, this is a problem of legibility.",
      "Typographers are concerned with legibility insofar as it is their job to	select the correct font to use. Brush Script is an example of a font containing many characters that might be difficult to distinguish. The	selection of cases influences the legibility of typography because using only uppercase letters (all-caps) reduces legibility.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quis culpa assumenda asperiores explicabo dolor, nostrum, neque sit ratione accusantium facere odit nisi quaerat repellat, quam dolores nihil. Possimus, neque?",
  ]


  return (
    <article className="w-full max-w-[75%] h-48">
      <ScrollableArea
        elementType="span"
        heading={sampleHeading}
        text={sampleText}
      />
    </article>
  )
}
