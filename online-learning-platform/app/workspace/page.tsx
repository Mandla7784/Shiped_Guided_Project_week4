"use client"
import React, { useState } from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import CourseDialog from './_components/CourseDialog'

export default function WorkSpace() {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div>
      <WelcomeBanner onCreateCourse={() => setOpenDialog(true)} />
      <CourseList />
      <CourseDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  )
}
