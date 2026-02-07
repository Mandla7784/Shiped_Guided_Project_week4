import { redirect } from 'next/server'

export default function SignInPage() {
  redirect('/auth/sign-in')
}
