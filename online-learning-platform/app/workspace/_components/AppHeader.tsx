import { User } from 'lucide-react'
import React from 'react'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'



export default function AppHeader() {
  return (
    <div className="flex items-center justify-between">
        <SidebarTrigger/>
        <UserButton/>
    </div>
  )
}