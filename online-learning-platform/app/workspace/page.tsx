"use client"
import React, { useState } from "react"
import WelcomeBanner from "./_components/WelcomeBanner"
import CourseList from "./_components/CourseList"

export default function DashboardPage() {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-6">Create and manage your courses.</p>
      <WelcomeBanner onCreateCourse={() => setOpenDialog(true)} />
      <CourseList />
    </div>
  )
}
