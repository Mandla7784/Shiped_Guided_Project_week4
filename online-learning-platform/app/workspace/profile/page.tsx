"use client"
import React from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import { User, Mail } from "lucide-react"

export default function ProfilePage() {
  const { user } = useUser()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">User Profile</h1>
      <p className="text-gray-500 mb-8">Your account information.</p>
      <div className="border rounded-lg p-6 bg-white max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <UserButton />
          <div>
            <h2 className="font-semibold text-lg">{user?.fullName ?? "User"}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </p>
          </div>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">First name</dt>
            <dd>{user?.firstName ?? "-"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Last name</dt>
            <dd>{user?.lastName ?? "-"}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
