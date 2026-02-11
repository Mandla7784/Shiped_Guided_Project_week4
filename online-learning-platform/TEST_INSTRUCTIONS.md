# Testing Course Creation

## Quick Test via Browser

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** and go to: `http://localhost:3000`

3. **Sign in** with Clerk (if not already signed in)

4. **Navigate to workspace** and click "Create New Course"

5. **Fill in the form**:
   - Title: "Introduction to TypeScript"
   - Description: "Learn TypeScript fundamentals"
   - Category: Programming
   - Difficulty: Beginner
   - Chapters: 5
   - (Optional) Include video: No

6. **Click "Generate Course"**

## What to Check

✅ **Success indicators:**
- Form submits without errors
- Loading spinner shows
- Course appears in course list after generation
- No error alerts

❌ **If errors occur:**
- Check browser console (F12) for error details
- Check server terminal for backend errors
- Share the error message

## Test via Terminal (Alternative)

If you have Node.js 18+, you can run:
```bash
node test-course-creation.js
```

Or use curl:
```bash
curl -X POST http://localhost:3000/api/generate-course \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Introduction to TypeScript",
    "description": "Learn TypeScript fundamentals",
    "category": "programming",
    "difficulty": "beginner",
    "chapters": 5,
    "includeVideo": false
  }'
```

## Expected Behavior

1. API receives the request
2. Gemini API generates course content
3. Banner image is generated (may take a moment)
4. Course is saved to database
5. Success response returned
6. Course appears in UI
