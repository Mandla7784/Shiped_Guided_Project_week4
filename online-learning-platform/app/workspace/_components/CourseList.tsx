import { Button } from '@/components/ui/button'
import React from 'react'

export default function CourseList() {
  return (
    <div className="mt-8 text-center p-10 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Create Your Course</h2>
      <p className="mb-4 text-gray-500">Get started by creating your first course.</p>
      <Button className="bg-purple-600 text-white hover:bg-purple-700"> + Create your first course</Button>
    </div>
  )
}