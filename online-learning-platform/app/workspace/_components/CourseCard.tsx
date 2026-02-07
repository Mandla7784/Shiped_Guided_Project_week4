"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, BookOpen } from 'lucide-react'

interface CourseCardProps {
  cid: number
  name: string
  description: string
  level?: string | null
  category?: string | null
  noOfChapters: number
  bannerImageDataUrl?: string | null
}

export default function CourseCard({ cid, name, description, level, category, noOfChapters, bannerImageDataUrl }: CourseCardProps) {
  return (
    <Link href={`/workspace/courses/${cid}`}>
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
        <div className="aspect-video bg-gray-100 relative">
          {bannerImageDataUrl ? (
            <img src={bannerImageDataUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
              <BookOpen className="w-12 h-12 text-purple-300" />
            </div>
          )}
          {level && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-white/90 capitalize">
              {level}
            </span>
          )}
        </div>
        <div className="p-4">
          {category && <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{category}</p>}
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{noOfChapters} chapters</span>
          </div>
          <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">View Course</Button>
        </div>
      </div>
    </Link>
  )
}
