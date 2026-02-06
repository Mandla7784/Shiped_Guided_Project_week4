"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const { isSignedIn } = useUser();

  const handleMyLearning = () => {
    if (isSignedIn) {
      window.location.href =
        "https://3000-cs-265260782811-default.cs-europe-west1-iuzs.cloudshell.dev/workspace";
    } else {
      // Redirect to Clerk sign-in
      window.location.href = "/sign-in";
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      
      {/* Navbar */}
      <header className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur z-20">
        <div>
          <h1 className="text-xl font-bold">Online Learning Platform</h1>
          <p className="text-sm font-semibold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
            AI-powered online learning
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button size="sm">Get Started</Button>
          <UserButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center flex-1">
        
        {/* Background Image */}
        <Image
          src="/online-courses-for-coding-1.jpg"
          alt="Online coding courses"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Learn Skills. Build Projects. Grow.
          </h2>

          <p className="text-gray-200 mb-6">
            Learn modern tech skills through AI-assisted lessons, real projects,
            and structured learning paths.
          </p>

          <div className="flex justify-center gap-4">
            <Button className="shadow-lg">
              Browse Courses
            </Button>

            <Button
              variant="outline"
              className="text-white border-white shadow-lg"
              onClick={handleMyLearning}
            >
              My Learning
            </Button>
          </div>
        </div>

      </section>

    </main>
  );
}
