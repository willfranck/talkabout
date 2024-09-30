import Link from "next/link"

export default function Header() {
  return (
    <header className="flex items-center justify-center w-full h-16">
      <div className="flex items-center justify-center gap-4">
        <Link href={"/"}>
          Home
        </Link>
        <Link href={"/about"}>
          About
        </Link>
        <Link href={"/login"}>
          Login
        </Link>
      </div>
    </header>
  )
}
