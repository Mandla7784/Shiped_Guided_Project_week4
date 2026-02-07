"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [userDetail, setUserDetail] = useState<{ email?: string; name?: string } | undefined>(undefined)

  useEffect(() => {
    if (!user) return
    setUserDetail({ email: user.primaryEmailAddress?.emailAddress, name: user.fullName ?? undefined })
    const sync = async () => {
      try {
        const { data } = await axios.post('/api/user', {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        })
        setUserDetail(data)
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 503) {
          return
        }
        console.error('Error syncing user:', err)
      }
    }
    sync()
  }, [user])

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider