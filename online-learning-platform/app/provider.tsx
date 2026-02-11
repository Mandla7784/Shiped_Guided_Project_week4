"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [userDetail, setUserDetail] = useState<{ email?: string; name?: string } | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only sync after component is mounted and user is loaded
    if (!mounted || !isLoaded || !user) return
    setUserDetail({ email: user.primaryEmailAddress?.emailAddress, name: user.fullName ?? undefined })
    const sync = async () => {
      try {
        const { data } = await axios.post('/api/user', {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        })
        setUserDetail(data)
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          const errorData = err.response?.data
          
          // Handle service unavailable (database not configured or tables missing)
          if (status === 503) {
            console.warn('Database not available:', errorData?.details || errorData?.error)
            // Don't show error to user, just use Clerk data
            return
          }
          
          // Log other errors with details
          if (status === 500) {
            const errorInfo = {
              message: errorData?.message || err.message || 'Unknown error',
              details: errorData?.details || 'No details available',
              code: errorData?.code || 'No error code',
              status: status,
              response: errorData
            }
            console.error('Error syncing user:', errorInfo)
            
            // If it's a table not found error, show helpful message
            if (errorData?.details?.includes('does not exist') || errorData?.details?.includes('migrations')) {
              console.error('⚠️ Database tables not found! Please run: npx drizzle-kit push')
            }
          } else if (status) {
            // Log non-500 errors (like 400, 401, etc.)
            console.warn('User sync warning:', {
              status: status,
              message: errorData?.error || err.message || 'Unknown error',
              details: errorData?.details
            })
          } else {
            // Network or other errors
            console.error('User sync failed:', err.message || 'Network error')
          }
        } else {
          console.error('Error syncing user:', err)
        }
      }
    }
    sync()
  }, [user, isLoaded, mounted])

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider