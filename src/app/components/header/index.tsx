"use client"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Nav } from "@ui/radix-elements"
import { SignOut } from "@phosphor-icons/react/dist/ssr"

export default function Header() {
  const pathname = usePathname()
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Login", path: "/login" },
  ]

  
  return (
    <header className="flex items-center justify-between w-full h-16 px-4">
      <Image 
        src="/images/Llama.webp" 
        alt="logo" 
        width={40} 
        height={40} 
        className="w-10 h-10 light:invert rounded-tr-[30%] rounded-bl-[30%]"
      />

      <Nav 
        links={links.map(link => ({
          ...link,
          active: link.path === pathname
        }))} 
      />
      
      <div className="flex items-center justify-center w-10 h-10">
        <SignOut size={24} />
      </div>
    </header>
  )
}
