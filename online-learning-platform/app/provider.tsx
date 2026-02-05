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
         console.log('User data:', { 
           fullName: user?.fullName, 
           email: user?.primaryEmailAddress?.emailAddress,
           emailAddresses: user?.emailAddresses 
         })
         
         const results = await axios.post("/api/user" ,{
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress
         })
         console.log('User created:', results.data)
         setUserDetail(results.data);
       } catch (error) {
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