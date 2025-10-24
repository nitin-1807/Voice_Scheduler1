# mypa - Voice-Powered Personal Assistant

## Overview
mypa is a mobile-first web application that helps users manage tasks and schedules using voice commands. Built for Android devices (works on all browsers), it provides an intuitive voice-first interface for creating tasks, setting reminders, and organizing daily activities.

## Key Features
- **Voice Input**: Create tasks naturally using Web Speech API
- **Task Management**: Organize tasks by priority (low/medium/high)
- **Schedule View**: Weekly calendar view with task visualization
- **Browser Notifications**: Reminders for upcoming tasks
- **Text-to-Speech**: Voice notifications for task reminders
- **Mobile-Optimized**: Responsive design with bottom navigation
- **PWA-Ready**: Can be installed on Android home screen

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Storage**: In-memory storage (MemStorage)
- **Voice**: Web Speech API, SpeechSynthesis API
- **State Management**: TanStack Query (React Query)
- **Date Handling**: date-fns
- **Routing**: Wouter

## Project Structure
```
client/
  src/
    components/     # Reusable UI components
      BottomNav.tsx       # Bottom tab navigation
      Header.tsx          # Top header with notifications
      VoiceFAB.tsx        # Floating action button for voice
      VoiceModal.tsx      # Voice recording modal
      TaskCard.tsx        # Individual task display
      TaskForm.tsx        # Task creation/edit form
      EmptyState.tsx      # Empty state UI
    pages/          # Main application pages
      TodayPage.tsx       # Today's tasks view
      TasksPage.tsx       # All tasks organized by priority
      SchedulePage.tsx    # Weekly schedule calendar
      SettingsPage.tsx    # App settings and help
    hooks/          # Custom React hooks
      useVoiceRecognition.ts  # Voice input handling
      useNotifications.ts     # Browser notifications & TTS
server/
  routes.ts       # API endpoints
  storage.ts      # In-memory data storage
shared/
  schema.ts       # Shared TypeScript types and schemas
```

## API Endpoints
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Data Model
**Task**:
- id: string (UUID)
- title: string (required)
- description: string (optional)
- dueDate: timestamp (optional)
- priority: "low" | "medium" | "high"
- completed: boolean
- createdAt: timestamp

## Voice Commands
Users can speak naturally to create tasks. Examples:
- "Meeting with team tomorrow at 3pm"
- "Buy groceries"
- "Call mom on Friday at 5"
- "Finish report by next Monday"

The app captures the transcription and creates a task with the spoken text as the title.

## Browser Compatibility
- Chrome/Edge (best support for Web Speech API)
- Safari (limited voice support)
- Firefox (requires manual text input fallback)

## Recent Changes
- 2025-10-24: Initial project setup with full MVP features
  - Implemented voice recognition and task management
  - Created mobile-first responsive design
  - Added notification support
  - Built weekly schedule view
