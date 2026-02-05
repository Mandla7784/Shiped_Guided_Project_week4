import React from 'react'

export default function WorkspaceProvider({children}: { children: React.ReactNode }) {
  return (
    <div>{ children }</div>
  )
}
