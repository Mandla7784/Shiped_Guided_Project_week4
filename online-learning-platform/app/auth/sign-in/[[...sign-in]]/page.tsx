import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className='flex items-center justify-center h-screen'>
      <SignIn fallbackRedirectUrl="/workspace" signUpUrl="/sign-up" />
  </div>
  
  )

}