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
    <header className="flex items-center justify-center w-full h-16">
      <Nav links={links} />
    </header>
  )
}
