# Course Creation Architecture

This directory contains a clean, modular architecture for course creation with video uploads.

## Key Features

- Clean separation of concerns with small, focused components
- Explicit video upload triggering only on form submission
- Simplified upload flow to avoid CORS issues
- Improved error handling and user feedback
- Type-safe component interfaces with React refs

## Components

### `CourseForm`

The main form component that integrates all other components and handles form submission.

### `VideoSection`

Manages video selection and playback, exposing an upload method via ref that's only called on form submission.

### `VideoUploader`

Handles the actual video upload process, communicating with the MediaCMS service.

### `VideoPlayer`

Displays the selected video and provides playback controls.

### `ChaptersList`

Manages the list of chapters, allowing users to add, edit, and delete chapters.

## Services

### `CourseService`

Handles course and chapter creation via GraphQL mutations.

### `MediaCMSService`

Manages video uploads using a simplified approach that avoids CORS issues.

## Usage

```tsx
import { CourseForm } from '@/features/courses/create';

export default function CoursePage() {
  return (
    <div>
      <h1>Create Course</h1>
      <CourseForm />
    </div>
  );
}
```

## Architecture Diagram

```
CourseForm
  ├── useCourseForm (state management)
  ├── VideoSection (ref-based upload trigger)
  │    ├── VideoPlayer
  │    └── VideoUploader
  ├── ChaptersList
  └── CourseService
       └── MediaCMSService
```

This architecture ensures that video uploads are only triggered on explicit form submission, never during chapter operations or other actions.
