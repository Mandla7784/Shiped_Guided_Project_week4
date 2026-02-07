"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { BookOpen, Clock, Loader2, Play } from 'lucide-react'

interface CourseJson {
  course?: {
    name: string
    description: string
    chapters?: Array<{ name: string; duration: string }>
    bannerImageDataUrl?: string
  }
}

interface Course {
  cid: number
  name: string
  description: string
  noOfChapters: number
  level?: string | null
  category?: string | null
  courseJson?: CourseJson | null
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cid = Number(params.cid)
  const [course, setCourse] = useState<Course | null>(null)
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isNaN(cid)) return
    Promise.all([
      fetch(`/api/courses/${cid}`).then((r) => r.json()),
      fetch('/api/enrollments').then((r) => r.json()).catch(() => []),
    ]).then(([courseData, enrolledCids]: [Course, number[]]) => {
      setCourse(courseData)
      setEnrolled(Array.isArray(enrolledCids) && enrolledCids.includes(cid))
    }).catch(() => setCourse(null)).finally(() => setLoading(false))
  }, [cid])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await axios.post('/api/enroll', { courseCid: cid })
      setEnrolled(true)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  const chapters = course.courseJson?.course?.chapters ?? []
  const bannerUrl = course.courseJson?.course?.bannerImageDataUrl

  return (
    <div>
      <div className="border rounded-lg overflow-hidden shadow-sm bg-white mb-6">
        <div className="aspect-video max-h-80 bg-gray-100 relative">
          {bannerUrl ? (
            <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
              <BookOpen className="w-16 h-16 text-purple-300" />
            </div>
          )}
        </div>
        <div className="p-6">
          {course.category && <p className="text-sm text-gray-500 uppercase tracking-wide">{course.category}</p>}
          <h1 className="text-2xl font-bold mt-1">{course.name}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.noOfChapters} chapters</span>
            {course.level && <span className="capitalize">{course.level}</span>}
          </div>
          <div className="flex gap-3 mt-6">
            {enrolled ? (
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href={`/workspace/courses/${cid}/learn`}>
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Link>
              </Button>
            ) : (
              <Button onClick={handleEnroll} disabled={enrolling} className="bg-purple-600 hover:bg-purple-700">
                {enrolling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">Course Layout</h2>
        <ul className="space-y-2">
          {chapters.map((ch, i) => (
            <li key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{ch.name}</p>
                <p className="text-sm text-gray-500">{ch.duration}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
