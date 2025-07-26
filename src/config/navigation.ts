import { CheckSquare, Home, LucideIcon } from "lucide-react"

export interface MenuItem {
  name: string
  href: string
  icon: LucideIcon
}

export const menuItems: MenuItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home
  },
  {
    name: "Todo",
    href: "/todo",
    icon: CheckSquare
  }
]
