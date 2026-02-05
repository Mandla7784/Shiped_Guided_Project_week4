import React from 'react'

import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

export default function WorkspaceProvider({children}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <AppHeader />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
