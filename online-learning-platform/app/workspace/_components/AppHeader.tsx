import { User } from 'lucide-react'
import React from 'react'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'



export default function AppHeader() {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 shadow-sm">
        <SidebarTrigger/>
        <UserButton/>
    </div>
  )
}