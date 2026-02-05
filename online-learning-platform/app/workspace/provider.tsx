import React from 'react'

import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

export default function WorkspaceProvider({children}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <AppHeader/>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
