import Image from "next/image"
import { Nav } from "@ui/radix-elements"


export default function Header() {
  const links = [
    {
      linkName: "Home",
      linkAddress: "/",
    },
    {
      linkName: "About",
      linkAddress: "/about",
    },
    {
      linkName: "Login",
      linkAddress: "/login",
    },
  ]

  
  return (
    <header className="flex justify-between items-center w-full h-16 px-4">
      <Image 
        src="/images/Llama.webp" 
        alt="logo" 
        width={40} 
        height={40} 
        className="w-10 h-10 dark:invert rounded-full"
      />

      <Nav links={links} />
      
      <div className="w-10 h-10"></div>
    </header>
  )
}
