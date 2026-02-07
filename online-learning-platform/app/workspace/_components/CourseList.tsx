"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CourseCard from './CourseCard'
import { Skeleton } from '@/components/ui/skeleton'

interface Course {
  id: number
  cid: number
  name: string
  description: string
  noOfChapters: number
  level?: string | null
  category?: string | null
  courseJson?: { course?: { bannerImageDataUrl?: string | null } } | null
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = (showLoading = true) => {
    if (showLoading) setLoading(true)
    axios.get<Course[]>('/api/courses').then((res) => {
      setCourses(res.data || [])
    }).catch(() => setCourses([])).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    const handler = () => fetchCourses(false)
    window.addEventListener('course-created', handler)
    return () => window.removeEventListener('course-created', handler)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="mt-8 text-center p-10 border rounded-lg bg-gray-50">
        <h2 className="text-2xl font-bold mb-2">No courses yet</h2>
        <p className="mb-4 text-gray-500">Create your first course using the sidebar button or Dashboard.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {courses.map((course) => (
        <CourseCard
          key={course.cid}
          cid={course.cid}
          name={course.name}
          description={course.description}
          level={course.level}
          category={course.category}
          noOfChapters={course.noOfChapters}
          bannerImageDataUrl={course.courseJson?.course?.bannerImageDataUrl ?? undefined}
        />
      ))}
    </div>
  )
}
