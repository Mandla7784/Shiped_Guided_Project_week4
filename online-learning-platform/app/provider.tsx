import React from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { useEffect } from 'react';

function Provider({ children }: { children: React.ReactNode }) {
   const { user } = useUser();
     
   useEffect(()=>{
    user && CreateNewUser();
   },[user])




    const CreateNewUser = async ()=>{
       const results = await axios.post("/api/user" ,{
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress
       })

    }
  return (
    <div>{ children }</div>
  )
}

export default Provider