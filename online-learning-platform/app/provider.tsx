"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { useEffect , useState} from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({ children }: { children: React.ReactNode }) {
   const { user } = useUser();
     const [userDetail, setUserDetail] = useState();

   useEffect(()=>{
    user && CreateNewUser();
   },[user])


    const CreateNewUser = async ()=>{
       try {
         const results = await axios.post("/api/user" ,{
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress
         })
         setUserDetail(results.data);
       } catch (error: unknown) {
         if (axios.isAxiosError(error) && error.response?.status === 503) {
           console.warn('User sync skipped: database not configured. Add DATABASE_URL to .env.local.')
           setUserDetail({ email: user?.primaryEmailAddress?.emailAddress, name: user?.fullName })
           return
         }
         console.error('Error creating user:', error)
       }
    }
    
  return (
    <UserDetailContext.Provider value={{userDetail , setUserDetail}}>
    <div>{ children }</div>
    </UserDetailContext.Provider>

  )
}

export default Provider