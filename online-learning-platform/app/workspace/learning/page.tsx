"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Loader2 } from "lucide-react"

type Course = { cid: number; name: string; description: string; noOfChapters: number; courseJson?: { course?: { bannerImageDataUrl?: string } } | null }

export default function MyLearningPage() {
  const [enrolledCids, setEnrolledCids] = useState<number[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/enrollments").then((r) => r.json()).then((d) => setEnrolledCids(Array.isArray(d) ? d : [])).catch(() => [])
    fetch("/api/courses").then((r) => r.json()).then((d) => setCourses(Array.isArray(d) ? d : [])).catch(() => [])
  }, [])

  if (loading) {
    setTimeout(() => setLoading(false), 500)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  const enrolled = courses.filter((c) => enrolledCids.includes(c.cid))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">My Learning Progress</h1>
      <p className="text-gray-500 mb-8">Courses you are enrolled in.</p>
      {enrolled.length === 0 ? (
        <div className="border rounded-lg p-10 bg-gray-50 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">You have not enrolled in any course yet.</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/workspace/courses">Explore Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolled.map((c) => (
            <div key={c.cid} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="aspect-video bg-gray-100">
                {c.courseJson?.course?.bannerImageDataUrl ? (
                  <img src={c.courseJson.course.bannerImageDataUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                    <BookOpen className="w-12 h-12 text-purple-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{c.noOfChapters} chapters</p>
                <Button asChild className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                  <Link href={`/workspace/courses/${c.cid}/learn`}>Continue Learning</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
