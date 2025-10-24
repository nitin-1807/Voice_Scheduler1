# Design Guidelines for mypa - Voice-Powered Personal Assistant

## Design Approach

**Hybrid Approach**: Material Design foundation with inspiration from Linear and Todoist for modern productivity aesthetics. This app prioritizes clarity, efficiency, and intuitive voice interaction patterns.

**Justification**: As a productivity tool for task management and scheduling, the design must emphasize usability, quick information scanning, and minimal cognitive load while supporting the unique voice-first interaction model.

## Core Design Elements

### Typography

**Font Family**: Inter (via Google Fonts CDN)
- **Primary Font**: Inter for all UI text
- **Fallback**: system-ui, -apple-system, sans-serif

**Type Scale**:
- **Hero/Empty States**: text-3xl (30px), font-semibold
- **Section Headers**: text-xl (20px), font-semibold
- **Task Titles**: text-base (16px), font-medium
- **Metadata/Time**: text-sm (14px), font-normal
- **Micro Labels**: text-xs (12px), font-medium, uppercase tracking-wide

### Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4, p-6
- Section spacing: space-y-4, gap-6
- Icon margins: mr-2, ml-2
- Card padding: p-6
- Screen padding: px-4 (mobile), px-6 (desktop)

**Container Strategy**:
- Main container: max-w-2xl mx-auto (optimized for mobile reading)
- Full-width sections: w-full with inner max-w-4xl for calendar views
- Task cards: w-full with consistent internal spacing

**Grid System**:
- Mobile: Single column (grid-cols-1)
- Tablet/Desktop: 2 columns for calendar view (grid-cols-2)

### Component Library

#### A. Voice Input Interface

**Floating Action Button (FAB)**:
- Large circular button (w-16 h-16) fixed to bottom-right corner
- Microphone icon from Heroicons (outline)
- Prominent elevation with shadow-2xl
- When recording: Pulsing animation ring around button
- Position: fixed bottom-8 right-8 on desktop, bottom-6 right-6 on mobile

**Voice Recording Modal**:
- Full-screen overlay on mobile, centered modal on desktop
- Waveform visualization during recording (use Web Audio API visualization)
- Transcription preview text area
- Action buttons: "Cancel" and "Create Task/Event"
- Layout: Centered content with max-w-lg

#### B. Navigation

**Bottom Tab Bar** (Mobile Primary):
- Fixed bottom navigation with 4 tabs
- Icons: Today (calendar), Tasks (checklist), Schedule (clock), Settings (cog)
- Active state: Filled icon variant with indicator line
- Height: h-16 with safe-area-inset-bottom padding

**Top Header**:
- App title "mypa" in text-2xl font-bold
- Current date/time display in text-sm
- Notification bell icon (top-right)
- Height: h-16 with subtle border-bottom

#### C. Task Components

**Task Card**:
- Full-width cards with rounded-lg corners
- Left border accent (4px width) for priority visualization
- Checkbox (w-5 h-5) aligned to left
- Task title in text-base, metadata below in text-sm
- Right-aligned time/due date
- Padding: p-4 with gap-3 between elements
- Hover state: Subtle background shift

**Task List Container**:
- Grouped by: Today, Tomorrow, Upcoming, Completed
- Section headers with text-sm font-semibold uppercase
- Dividers between groups (border-b)
- Empty state: Centered illustration with helpful text

**Quick Actions** (Swipe on mobile):
- Swipe left reveals: Complete, Edit, Delete
- Action buttons in w-20 each
- Icons: Check, Pencil, Trash from Heroicons

#### D. Calendar/Schedule View

**Week View Grid**:
- 7 columns on desktop (grid-cols-7)
- Horizontal scroll on mobile with snap-scroll
- Day headers: text-xs uppercase
- Time blocks: h-20 per hour slot
- Events: Absolute positioned overlays with rounded corners

**Month View**:
- Calendar grid with day numbers
- Event dots (w-2 h-2 rounded-full) indicating scheduled items
- Today highlight: Ring border
- Selected day: Solid background

#### E. Forms & Inputs

**Voice-Transcribed Input Fields**:
- Standard text inputs with microphone icon suffix
- Placeholder text guides voice commands ("Say 'Meeting tomorrow at 3pm'")
- Helper text below shows example voice commands
- Height: h-12 with px-4 padding

**Date/Time Pickers**:
- Native input fields enhanced with custom styling
- Icon prefixes (calendar/clock from Heroicons)
- Inline label above input

**Priority Selector**:
- Horizontal button group with 3 options: Low, Medium, High
- Icon + text combination
- Selected state with ring-2

#### F. Notifications Panel

**Notification Card**:
- Slide-in from top on trigger
- Icon (bell/alert) + title + message
- Dismiss button (X icon)
- Action buttons for task-related notifications
- Auto-dismiss after 5 seconds
- Width: max-w-md on desktop, full-width on mobile

**Notification List** (in Settings):
- Chronological list with read/unread states
- Grouped by date (Today, Yesterday, Earlier)
- Mark all read button at top

#### G. Empty States

**No Tasks View**:
- Centered content with max-w-sm
- Illustration or large icon (w-32 h-32)
- Heading: "No tasks yet"
- Subtext: "Tap the mic button to create your first task"
- CTA button: "Get Started"

**First-Time User Experience**:
- Welcome modal on first launch
- 3-step tutorial cards explaining voice commands
- Skip/Next navigation
- Example voice commands displayed

### Animations

**Minimal, Purposeful Motion**:
- FAB pulse: Subtle scale animation when recording (2-second loop)
- Page transitions: Slide-in from right (200ms)
- Task completion: Checkbox check with strikethrough fade (300ms)
- Card interactions: Transform scale(1.02) on tap/hover (150ms)

**Critical**: No autoplay animations. All motion triggered by user action.

### Accessibility

- All interactive elements: Minimum 44x44px touch targets
- Form inputs: Visible focus states with ring-2
- Skip to content link for keyboard navigation
- ARIA labels for icon-only buttons
- Voice command help always accessible via "?" icon

### Mobile-First Considerations

**Viewport**: Mobile-optimized (375px-428px primary breakpoints)
- Single column layout default
- Generous touch targets (min h-12 for buttons)
- Sticky header and bottom navigation for quick access
- Scroll-to-top button appears after scrolling down

**PWA Features**:
- Full-screen mode on mobile (standalone display)
- Install prompt after 2+ uses
- Offline mode with cached tasks
- Home screen icon (rounded square)

---

**Key Principle**: This design prioritizes immediate task capture via voice, clear task visualization, and effortless schedule management. Every interaction should feel natural and reduce friction between thought and action.