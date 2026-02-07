"use client"
import React, { useEffect, useState } from "react"
import CourseCard from "../_components/CourseCard"
import { Skeleton } from "@/components/ui/skeleton"

type Course = {
  id: number
  cid: number
  name: string
  description: string
  noOfChapters: number
  level?: string | null
  category?: string | null
  courseJson?: { course?: { bannerImageDataUrl?: string | null } } | null
}

export default function ExploreCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(Array.isArray(d) ? d : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">Explore Courses</h1>
        <p className="text-gray-500 mb-6">No courses available yet.</p>
        <div className="p-10 border rounded-lg bg-gray-50 text-center text-gray-500">
          Create a course from the Dashboard.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Explore Courses</h1>
      <p className="text-gray-500 mb-6">Browse all available courses.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <CourseCard
            key={c.cid}
            cid={c.cid}
            name={c.name}
            description={c.description}
            level={c.level}
            category={c.category}
            noOfChapters={c.noOfChapters}
            bannerImageDataUrl={c.courseJson?.course?.bannerImageDataUrl ?? undefined}
          />
        ))}
      </div>
    </div>
  )
}
