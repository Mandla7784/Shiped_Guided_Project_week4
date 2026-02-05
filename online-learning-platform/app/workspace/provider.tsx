import React from 'react'

import { SidebarProvider , SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'


export default function WorkspaceProvider({children}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar/>
    <SidebarTrigger />
       <div>{ children }</div>
    </SidebarProvider>

  )
}
