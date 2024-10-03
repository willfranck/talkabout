import Image from "next/image"
import { Nav } from "@ui/radix-elements"
import { SignOut } from "@phosphor-icons/react/dist/ssr"

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
        className="w-10 h-10 light:invert rounded-tr-[30%] rounded-bl-[30%]"
      />

      <Nav links={links} />
      
      <div className="flex justify-center items-center w-10 h-10">
        <SignOut size={24} />
      </div>
    </header>
  )
}
