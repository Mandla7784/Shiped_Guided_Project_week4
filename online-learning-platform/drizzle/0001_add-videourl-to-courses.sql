-- Add videoUrl column to courses table if it doesn't exist
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "videoUrl" varchar(500);
