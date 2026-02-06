import React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface WelcomeBannerProps {
  onCreateCourse: () => void
}

export default function WelcomeBanner({ onCreateCourse }: WelcomeBannerProps) {
  return (
    <div className="p-5 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome to Online Learning</h2>
          <p>Learn, Create and Explore Your favourite courses</p>
        </div>
        <Button onClick={onCreateCourse} className="bg-white text-purple-600 hover:bg-gray-100">
          <Sparkles className="w-4 h-4 mr-2" />
          Create New Course
        </Button>
      </div>
    </div>
  )
}
