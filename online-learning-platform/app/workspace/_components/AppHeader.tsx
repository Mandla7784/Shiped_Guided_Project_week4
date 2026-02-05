import { User } from 'lucide-react'
import React from 'react'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'



export default function AppHeader() {
  return (
    <div>
        <SidebarTrigger/>
        <UserButton/>
    </div>
  )
}