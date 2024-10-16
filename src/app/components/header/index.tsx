"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Flex } from "@radix-ui/themes"
import { Nav } from "@ui/radix-elements"
import { SignOut } from "@phosphor-icons/react/dist/ssr"

export default function Header() {
  const pathname = usePathname()
  const links = [
    { name: "Home", path: "/" },
    { name: "Chat", path: "/chat" },
    // { name: "Login", path: "/login" },
  ]

  
  return (
    <header className="flex items-center justify-between w-full h-16 px-4">
      <Link href={"/"}>
        <Image 
          src="/images/Llama.webp" 
          alt="logo" 
          width={40} 
          height={40} 
          className="w-10 h-10 rounded-logo invert dark:invert-0"
        />
      </Link>

      <Nav 
        links={links.map(link => ({
          ...link,
          active: link.path === pathname
        }))} 
      />
      
      <Flex align="center" justify="center" width="2.5rem" height="2.5rem">
        <SignOut size={24} />
      </Flex>
    </header>
  )
}
