import React from 'react'
import WorkspaceProvider from './provider'
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
       { children}
    </WorkspaceProvider>
   
  )
}
