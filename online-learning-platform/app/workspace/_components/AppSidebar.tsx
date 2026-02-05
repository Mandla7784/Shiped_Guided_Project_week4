import React from 'react'
import { usePathname } from 'next/navigation'path 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { LayoutDashboard, CreditCard, User, BookOpen, Settings } from 'lucide-react'
import Link from 'next/link'

const sideBarOptions = [
  {
    title: "Workspace",
    icon: LayoutDashboard,
    path: "/workspace"
  },
  {
    title: "Billing",
    icon: CreditCard,
    path: "/workspace/billing"
  },
  {
    title: "Profile",
    icon: User,
    path: "/workspace/profile"
  },
  {
    title: "My Learning",
    icon: BookOpen,
    path: "/workspace/learning"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/workspace/settings"
  }
]

export default function AppSidebar() {
  const path = usePathname()



  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Image src="/logo.svg" alt="logo" width={80} height={80} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button className="mb-4">Create New Course</Button>
          <SidebarMenu>
            {sideBarOptions.map((option) => (
              <SidebarMenuItem key={option.path}>
                <SidebarMenuButton asChild>
                  <Link href={option.path}>
                    <option.icon className="w-4 h-4" />
                    <span>{option.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
