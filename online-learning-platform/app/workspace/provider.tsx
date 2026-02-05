import React from 'react'

import { SidebarProvider , SidebarTrigger } from '@/components/ui/sidebar'


export default function WorkspaceProvider({children}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
    <SidebarTrigger />
       <div>{ children }</div>
    </SidebarProvider>

  )
}
