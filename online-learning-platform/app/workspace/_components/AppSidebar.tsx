"use client"
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
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
import CourseDialog from '@/components/CourseDialog'

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
  const [dialogOpen, setDialogOpen] = useState(false)



  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Image src="/logo.svg" alt="logo" width={80} height={80} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button 
            className="mb-4 bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => setDialogOpen(true)}
          >
            Create New Course
          </Button>
          <SidebarMenu>
            {sideBarOptions.map((option) => (
              <SidebarMenuItem key={option.path}>
                <SidebarMenuButton
                  asChild
                  className={
                    path === option.path ? "text-purple-600 font-bold" : ""
                  }
                >
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
      <CourseDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Sidebar>
  )
}
