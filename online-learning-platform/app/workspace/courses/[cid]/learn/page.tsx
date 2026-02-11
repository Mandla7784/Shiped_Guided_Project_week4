"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from "@/lib/youtube-utils";

interface CourseJson {
  course?: {
    name: string;
    chapters?: Array<{ name: string; duration: string }>;
  };
}

interface Course {
  cid: number;
  name: string;
  includeVideo?: boolean;
  videoUrl?: string | null;
  courseJson?: CourseJson | null;
}

export default function LearnPage() {
  const params = useParams();
  const cid = Number(params.cid);
  const [course, setCourse] = useState<Course | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [chapterContent, setChapterContent] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState(false);
  const hasLoadedFirst = useRef(false);

  useEffect(() => {
    if (isNaN(cid)) return;
    fetch(`/api/courses/${cid}`)
      .then((r) => r.json())
      .then(setCourse)
      .catch(() => setCourse(null));
    fetch(`/api/progress?courseCid=${cid}`)
      .then((r) => r.json())
      .then((d) => setCompletedChapters(d.completedChapters || []))
      .catch(() => setCompletedChapters([]));
  }, [cid]);

  const chapters = course?.courseJson?.course?.chapters ?? [];

  useEffect(() => {
    if (course && chapters.length > 0 && !hasLoadedFirst.current) {
      hasLoadedFirst.current = true;
      const ch = chapters[0];
      setLoadingContent(true);
      axios
        .post("/api/generate-content", {
          courseName: course?.name,
          chapterName: ch.name,
          chapterIndex: 0,
        })
        .then(({ data }) => setChapterContent(data.content || ""))
        .catch(() => setChapterContent("Failed to load content."))
        .finally(() => setLoadingContent(false));
    }
  }, [course?.cid, chapters.length]);

  const loadChapterContent = async (index: number) => {
    setSelectedChapter(index);
    const ch = chapters[index];
    if (!ch) return;
    setLoadingContent(true);
    try {
      const { data } = await axios.post("/api/generate-content", {
        courseName: course?.name,
        chapterName: ch.name,
        chapterIndex: index,
      });
      setChapterContent(data.content || "");
    } catch {
      setChapterContent("Failed to load content. Try again.");
    } finally {
      setLoadingContent(false);
    }
  };

  const markComplete = async () => {
    try {
      await axios.post("/api/progress", {
        courseCid: cid,
        chapterIndex: selectedChapter,
      });
      setCompletedChapters((prev) =>
        prev.includes(selectedChapter) ? prev : [...prev, selectedChapter],
      );
    } catch {}
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const currentChapter = chapters[selectedChapter];
  const videoId = course.includeVideo && course.videoUrl ? extractYouTubeVideoId(course.videoUrl) : null;
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/workspace/courses/${cid}`}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to course
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-4">Chapters</h2>
          <ul className="space-y-1">
            {chapters.map((ch, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => loadChapterContent(i)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${selectedChapter === i ? "bg-purple-100 text-purple-800 font-medium" : "hover:bg-gray-100"}`}
                >
                  {completedChapters.includes(i) && (
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{ch.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2 border rounded-lg p-6 bg-white min-h-[400px]">
          {currentChapter ? (
            <>
              <h3 className="text-xl font-semibold">{currentChapter.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {currentChapter.duration}
              </p>
              {embedUrl && (
                <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    src={embedUrl}
                    title={currentChapter.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
              <div className="mt-6 prose prose-sm max-w-none">
                {loadingContent ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading
                    content...
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-gray-700">
                    {chapterContent || "Click a chapter to load content."}
                  </div>
                )}
              </div>
              {!loadingContent && chapterContent && (
                <Button
                  onClick={markComplete}
                  className="mt-6 bg-purple-600 hover:bg-purple-700"
                  disabled={completedChapters.includes(selectedChapter)}
                >
                  {completedChapters.includes(selectedChapter) ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : null}
                  {completedChapters.includes(selectedChapter)
                    ? "Completed"
                    : "Mark as complete"}
                </Button>
              )}
            </>
          ) : (
            <p className="text-gray-500">Select a chapter to start learning.</p>
          )}
        </div>
      </div>
    </div>
  );
}
