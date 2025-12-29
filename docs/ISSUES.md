# Actual.ly — GitHub Issues Breakdown

> **Project:** Actual.ly MVP  
> **Total Issues:** 47  
> **Estimated Time:** 4-6 weeks

---

## Labels

```
priority:critical  - Must have for MVP
priority:high      - Important for MVP
priority:medium    - Nice to have
priority:low       - Post-MVP

type:feature       - New feature
type:bug           - Bug fix
type:chore         - Setup, config, maintenance
type:docs          - Documentation

area:frontend      - UI/UX work
area:backend       - API/Database work
area:agent         - AI agent work
area:integrations  - Third-party integrations
```

---

## Milestones

| Milestone | Issues | Target |
|-----------|--------|--------|
| M1: Project Setup | #1-6 | Day 1-2 |
| M2: Identity Layer | #7-14 | Day 3-5 |
| M3: Dashboard Core | #15-22 | Day 6-9 |
| M4: Agent Core | #23-32 | Day 10-14 |
| M5: Social Layer | #33-40 | Day 15-20 |
| M6: Polish & Deploy | #41-47 | Day 21-25 |

---

## M1: Project Setup (Issues #1-6)

### Issue #1: Initialize Next.js Project
```
Title: Initialize Next.js 14 project with TypeScript and Tailwind

Labels: priority:critical, type:chore, area:frontend

Description:
Set up the base Next.js 14 project with all required dependencies.

Tasks:
- [ ] Create Next.js 14 app with App Router
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Install Lucide React icons
- [ ] Set up Framer Motion
- [ ] Configure path aliases (@/)
- [ ] Create basic folder structure

Acceptance Criteria:
- Project runs with `npm run dev`
- TypeScript compiles without errors
- Tailwind classes work
- shadcn/ui components can be imported

Folder Structure:
```
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── (public)/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── types.ts
├── hooks/
└── stores/
```
```

---

### Issue #2: Set up Supabase Database
```
Title: Set up Supabase project and database schema

Labels: priority:critical, type:chore, area:backend

Description:
Create Supabase project and implement the full database schema.

Tasks:
- [ ] Create Supabase project
- [ ] Set up environment variables
- [ ] Create users table
- [ ] Create user_links table
- [ ] Create connections table
- [ ] Create posts table
- [ ] Create post_likes table
- [ ] Create comments table
- [ ] Create agent_actions table
- [ ] Create saved_items table
- [ ] Create collections table
- [ ] Create reminders table
- [ ] Create user_integrations table
- [ ] Create messages table
- [ ] Create agent_conversations table
- [ ] Set up Row Level Security policies
- [ ] Create database indexes

Acceptance Criteria:
- All tables created in Supabase
- RLS policies in place
- Can connect from Next.js app
- Migrations documented

Reference: See SPEC.md Section 8 for full schema
```

---

### Issue #3: Configure Authentication with Clerk
```
Title: Set up Clerk authentication

Labels: priority:critical, type:chore, area:backend

Description:
Configure Clerk for authentication and verification.

Tasks:
- [ ] Create Clerk application
- [ ] Install @clerk/nextjs
- [ ] Configure environment variables
- [ ] Set up ClerkProvider in layout
- [ ] Create sign-in page
- [ ] Create sign-up page
- [ ] Set up middleware for protected routes
- [ ] Style Clerk components to match design

Acceptance Criteria:
- Users can sign up/sign in
- Protected routes redirect to auth
- Clerk UI matches app design
```

---

### Issue #4: Set up Environment Variables
```
Title: Configure all environment variables

Labels: priority:critical, type:chore, area:backend

Description:
Set up all required environment variables for the project.

Tasks:
- [ ] Create .env.local file
- [ ] Create .env.example file
- [ ] Add Supabase credentials
- [ ] Add Clerk credentials
- [ ] Add Cerebras API key placeholder
- [ ] Add Twilio credentials placeholder
- [ ] Add Google API credentials placeholder
- [ ] Document all variables in README

.env.example:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI
CEREBRAS_API_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Acceptance Criteria:
- All variables documented
- App runs with .env.local configured
```

---

### Issue #5: Create Design System and UI Components
```
Title: Set up design system with base UI components

Labels: priority:critical, type:feature, area:frontend

Description:
Create the foundational design system and reusable components.

Tasks:
- [ ] Define color palette in tailwind.config
- [ ] Create CSS variables for theming
- [ ] Set up dark mode with next-themes
- [ ] Create ThemeToggle component
- [ ] Install/configure shadcn components:
  - [ ] Button
  - [ ] Input
  - [ ] Card
  - [ ] Avatar
  - [ ] Badge
  - [ ] Dialog
  - [ ] Dropdown Menu
  - [ ] Tabs
  - [ ] Toast (Sonner)
  - [ ] Skeleton
- [ ] Create custom components:
  - [ ] Logo
  - [ ] VerifiedBadge
  - [ ] TrustScoreBar
  - [ ] StatCard

Acceptance Criteria:
- Light/dark mode toggle works
- All base components available
- Components match design spec
```

---

### Issue #6: Create Layout Components
```
Title: Create app layout components

Labels: priority:critical, type:feature, area:frontend

Description:
Build the main layout components for the app.

Tasks:
- [ ] Create PublicLayout (for landing, profiles)
- [ ] Create DashboardLayout (for authenticated pages)
- [ ] Create Navbar component
- [ ] Create Sidebar component (dashboard)
- [ ] Create Footer component
- [ ] Create MobileNav component
- [ ] Set up responsive breakpoints

Acceptance Criteria:
- Layouts render correctly
- Navigation works
- Responsive on mobile/tablet/desktop
- Sidebar collapses on mobile
```

---

## M2: Identity Layer (Issues #7-14)

### Issue #7: Create Landing Page
```
Title: Build the landing page (actual.ly)

Labels: priority:critical, type:feature, area:frontend

Description:
Create the main landing page matching the Actual.ly design.

Tasks:
- [ ] Create hero section
  - [ ] "Actual Humans Only" headline
  - [ ] "No ifs, ads, or bots" subheadline
  - [ ] Username claim input
  - [ ] "Get Started" button
- [ ] Create "About Actual.ly" section
- [ ] Create features section (optional)
- [ ] Create footer
- [ ] Add animations with Framer Motion
- [ ] Make fully responsive

Acceptance Criteria:
- Matches Actual.ly design
- Username input validates (10-50 chars)
- Continue button triggers auth flow
- Responsive on all devices
```

---

### Issue #8: Implement Username Claim Flow
```
Title: Build username claiming and validation

Labels: priority:critical, type:feature, area:backend, area:frontend

Description:
Allow users to claim unique usernames.

Tasks:
- [ ] Create API route: POST /api/auth/claim-username
- [ ] Validate username format (10-50 chars, alphanumeric + underscore)
- [ ] Check username availability
- [ ] Reserve username for user
- [ ] Create username input component with:
  - [ ] Real-time validation
  - [ ] Availability checking (debounced)
  - [ ] Error messages
  - [ ] Success state

Acceptance Criteria:
- Users can claim available usernames
- Taken usernames show error
- Invalid formats show validation error
- Username saved to database
```

---

### Issue #9: Implement Phone + Email Verification (Clerk)
```
Title: Implement Clerk verification flow

Labels: priority:critical, type:feature, area:frontend, area:backend

Description:
Implement real phone + email verification using Clerk.

Tasks:
- [ ] Create verification page UI
- [ ] Require phone + email verification via Clerk
- [ ] Update user.is_verified on verification
- [ ] Update user.verified_at timestamp
- [ ] Set initial trust score (+50 for phone verification)
- [ ] Redirect to dashboard on success
- [ ] Create VerificationSuccessModal

Acceptance Criteria:
- Phone + email verification works
- is_verified set to true after verification
- Trust score updated to 50
- User redirected to dashboard
```

---

### Issue #10: Build User Profile Page
```
Title: Create public profile page (actual.ly/username)

Labels: priority:critical, type:feature, area:frontend

Description:
Build the public-facing user profile page.

Tasks:
- [ ] Create dynamic route: /[username]/page.tsx
- [ ] Fetch user data by username
- [ ] Display:
  - [ ] Avatar
  - [ ] Display name
  - [ ] Username
  - [ ] Verified badge (if verified)
  - [ ] Trust score with visual bar
  - [ ] Bio
  - [ ] External links
  - [ ] Agent status card
  - [ ] Action buttons (Message, Connect)
- [ ] Handle user not found (404)
- [ ] Add OG meta tags for sharing
- [ ] Make responsive

Acceptance Criteria:
- Profile loads at /username
- Shows all user information
- Verified badge shows if verified
- 404 for non-existent users
```

---

### Issue #11: Implement Trust Score Calculation
```
Title: Build trust score calculation system

Labels: priority:high, type:feature, area:backend

Description:
Implement the trust score calculation logic.

Tasks:
- [ ] Create calculateTrustScore function
- [ ] Calculate points:
  - [ ] Phone verified (Actual Human): +50
  - [ ] Email verified: +10
  - [ ] Account age: +2/month (max 20)
  - [ ] Verified connections: +1 each (max 10)
  - [ ] Content engagement: +1 per 100 (max 10)
- [ ] Create API route: GET /api/users/:username/trust-score
- [ ] Create database trigger to recalculate on changes
- [ ] Create TrustScoreBreakdown component

Acceptance Criteria:
- Trust score calculates correctly
- Updates when factors change
- Breakdown shows point sources
```

---

### Issue #12: Create API Routes for Users
```
Title: Build user API endpoints

Labels: priority:critical, type:feature, area:backend

Description:
Create all user-related API endpoints.

Tasks:
- [ ] GET /api/users/:username - Get profile
- [ ] PATCH /api/users/:username - Update profile
- [ ] GET /api/users/:username/posts - Get user posts
- [ ] GET /api/users/:username/connections - Get connections
- [ ] Add authentication middleware
- [ ] Add authorization (own profile only for PATCH)
- [ ] Input validation with Zod
- [ ] Error handling

Acceptance Criteria:
- All endpoints work correctly
- Proper authentication/authorization
- Input validation in place
- Error responses standardized
```

---

### Issue #13: Build Profile Edit Page
```
Title: Create profile editing page

Labels: priority:high, type:feature, area:frontend

Description:
Allow users to edit their profile information.

Tasks:
- [ ] Create /dashboard/settings/profile page
- [ ] Build profile edit form:
  - [ ] Display name input
  - [ ] Bio textarea (160 char limit)
  - [ ] Avatar upload
  - [ ] External links management
- [ ] Save changes to database
- [ ] Show success/error toasts
- [ ] Add form validation

Acceptance Criteria:
- Users can edit their profile
- Changes save successfully
- Validation prevents invalid input
- Success feedback shown
```

---

### Issue #14: Add Phone/Email Verification
```
Title: Implement phone and email verification

Labels: priority:medium, type:feature, area:backend, area:frontend

Description:
Allow users to verify phone and email for trust score.

Tasks:
- [ ] Email verification via Clerk
- [ ] Phone verification via Clerk
- [ ] Update verification flags
- [ ] Recalculate trust score after verification
- [ ] Create verification UI in settings

Acceptance Criteria:
- Email verification works
- Phone verification works
- Trust score updates correctly
```

---

## M3: Dashboard Core (Issues #15-22)

### Issue #15: Create Dashboard Layout
```
Title: Build the main dashboard layout

Labels: priority:critical, type:feature, area:frontend

Description:
Create the dashboard layout with sidebar navigation.

Tasks:
- [ ] Create /dashboard/layout.tsx
- [ ] Build sidebar with navigation sections:
  - [ ] Dashboard: Overview, Feed, Messages
  - [ ] Agent: Chat, Actions, Settings
  - [ ] Insights: Analytics, Trust Score, Network
  - [ ] Settings: Profile, Integrations, Privacy
- [ ] Highlight active nav item
- [ ] Create collapsible sidebar for mobile
- [ ] Add user avatar and dropdown in header
- [ ] Add notification bell
- [ ] Add search bar

Acceptance Criteria:
- Dashboard layout renders correctly
- Navigation works
- Active states show properly
- Responsive sidebar
```

---

### Issue #16: Build Dashboard Overview Page
```
Title: Create the dashboard overview page

Labels: priority:critical, type:feature, area:frontend

Description:
Build the main dashboard overview with stats and activity.

Tasks:
- [ ] Create /dashboard/page.tsx
- [ ] Build stat cards:
  - [ ] Tasks completed
  - [ ] Links saved
  - [ ] Agent actions
- [ ] Create recent activity feed
- [ ] Build quick actions section:
  - [ ] Ask Agent button
  - [ ] New Post button
  - [ ] Check Feed button
  - [ ] Invite button
- [ ] Fetch real data from API
- [ ] Add loading skeletons

Acceptance Criteria:
- Overview shows real stats
- Activity feed updates
- Quick actions work
- Loading states show
```

---

### Issue #17: Create Saved Items and Collections
```
Title: Build saved items and collections feature

Labels: priority:high, type:feature, area:frontend, area:backend

Description:
Allow users to save links and organize into collections.

Tasks:
- [ ] Create API routes:
  - [ ] GET /api/collections
  - [ ] POST /api/collections
  - [ ] PATCH /api/collections/:id
  - [ ] DELETE /api/collections/:id
  - [ ] GET /api/saved
  - [ ] POST /api/saved
  - [ ] PATCH /api/saved/:id
  - [ ] DELETE /api/saved/:id
- [ ] Create default collections on user signup:
  - [ ] Jobs
  - [ ] Reading List
  - [ ] Tools
  - [ ] People
- [ ] Build collections sidebar
- [ ] Build saved items list view
- [ ] Add item status: Saved, In Progress, Done
- [ ] Add reminder functionality

Acceptance Criteria:
- Users can create collections
- Users can save items to collections
- Items can be moved between collections
- Status can be updated
```

---

### Issue #18: Build Agent Actions History Page
```
Title: Create agent actions history page

Labels: priority:high, type:feature, area:frontend

Description:
Show history of all agent actions.

Tasks:
- [ ] Create /dashboard/agent/actions page
- [ ] Fetch actions from API
- [ ] Display actions in chronological list:
  - [ ] Icon based on action type
  - [ ] Timestamp
  - [ ] Action description
  - [ ] Integration used (if any)
- [ ] Add filters:
  - [ ] By action type
  - [ ] By date range
  - [ ] By integration
- [ ] Add search functionality
- [ ] Add pagination
- [ ] Add export to CSV

Acceptance Criteria:
- Actions display correctly
- Filters work
- Search works
- Pagination works
```

---

### Issue #19: Create Agent Settings Page
```
Title: Build agent settings configuration page

Labels: priority:high, type:feature, area:frontend, area:backend

Description:
Allow users to configure their agent preferences.

Tasks:
- [ ] Create /dashboard/agent/settings page
- [ ] Build settings form:
  - [ ] Tone: Casual / Professional / Minimal
  - [ ] Proactivity: High / Medium / Low
  - [ ] Verbosity: Detailed / Concise / TL;DR
  - [ ] Work hours toggle and time pickers
  - [ ] Channel toggles: SMS, WhatsApp, Web
- [ ] Save settings to user.agent_settings
- [ ] Create API route: PATCH /api/agent/settings
- [ ] Show assigned phone number

Acceptance Criteria:
- Settings save correctly
- UI reflects current settings
- Changes take effect immediately
```

---

### Issue #20: Build Integrations Page
```
Title: Create integrations management page

Labels: priority:high, type:feature, area:frontend

Description:
Show available integrations and connection status.

Tasks:
- [ ] Create /dashboard/settings/integrations page
- [ ] Display integration cards:
  - [ ] Google Calendar
  - [ ] Gmail
  - [ ] Notion
  - [ ] Linear
  - [ ] Slack
  - [ ] Twitter/X
  - [ ] LinkedIn
  - [ ] GitHub
- [ ] Show connected/disconnected status
- [ ] Connect button triggers OAuth
- [ ] Disconnect button with confirmation
- [ ] Show connected scopes

Acceptance Criteria:
- All integrations display
- Status shows correctly
- Connect/disconnect buttons work
```

---

### Issue #21: Create Insights Overview Page
```
Title: Build analytics and insights dashboard

Labels: priority:medium, type:feature, area:frontend

Description:
Show user analytics and insights.

Tasks:
- [ ] Create /dashboard/insights page
- [ ] Build time saved metric:
  - [ ] Calculate from agent actions
  - [ ] Show comparison to last period
- [ ] Build agent usage chart:
  - [ ] Breakdown by action type
  - [ ] Pie or bar chart
- [ ] Show top actions list
- [ ] Display network stats:
  - [ ] Connection count
  - [ ] New this period
- [ ] Add date range selector

Acceptance Criteria:
- Stats calculate correctly
- Charts render properly
- Date range filter works
```

---

### Issue #22: Build Trust Score Page
```
Title: Create trust score breakdown page

Labels: priority:medium, type:feature, area:frontend

Description:
Show detailed trust score breakdown and improvement tips.

Tasks:
- [ ] Create /dashboard/insights/trust page
- [ ] Display overall score with progress ring
- [ ] Show breakdown by factor:
  - [ ] Phone verification (50 pts)
  - [ ] Email (10 pts)
  - [ ] Account age (max 20 pts)
  - [ ] Network (max 10 pts)
- [ ] Show score history over time
- [ ] Add improvement suggestions
- [ ] Link to relevant verification pages

Acceptance Criteria:
- Score displays correctly
- Breakdown is accurate
- Suggestions are actionable
```

---

## M4: Agent Core (Issues #23-32)

### Issue #23: Set Up Cerebras AI Integration
```
Title: Integrate Cerebras API

Labels: priority:critical, type:feature, area:agent

Description:
Set up the Cerebras API for the AI agent.

Tasks:
- [ ] Install @anthropic-ai/sdk
- [ ] Create AI client wrapper
- [ ] Set up system prompts
- [ ] Create chat completion function
- [ ] Handle streaming responses
- [ ] Implement error handling
- [ ] Add rate limiting
- [ ] Create token usage tracking

Acceptance Criteria:
- Cerebras API calls work
- System prompts set correctly
- Error handling in place
- Rate limiting works
```

---

### Issue #24: Build Agent Chat Interface
```
Title: Create web-based agent chat interface

Labels: priority:critical, type:feature, area:frontend, area:agent

Description:
Build the main chat interface for interacting with the agent.

Tasks:
- [ ] Create /dashboard/agent page
- [ ] Build chat UI:
  - [ ] Message list
  - [ ] User message bubbles
  - [ ] Agent message bubbles
  - [ ] Typing indicator
  - [ ] Timestamp display
- [ ] Create message input:
  - [ ] Text input
  - [ ] Send button
  - [ ] Link paste detection
- [ ] Implement send message:
  - [ ] POST to /api/agent/chat
  - [ ] Display response
  - [ ] Handle streaming
- [ ] Save conversation history
- [ ] Add quick action buttons

Acceptance Criteria:
- Chat interface works
- Messages send and receive
- History persists
- Streaming displays properly
```

---

### Issue #25: Implement Link Analysis
```
Title: Build link analysis feature for agent

Labels: priority:critical, type:feature, area:agent

Description:
Allow agent to analyze shared links and extract metadata.

Tasks:
- [ ] Detect URLs in messages
- [ ] Fetch URL metadata:
  - [ ] Title
  - [ ] Description
  - [ ] Image
  - [ ] Domain
- [ ] Generate AI summary of page content
- [ ] Detect link type:
  - [ ] Job posting
  - [ ] Article
  - [ ] Product
  - [ ] Profile
  - [ ] Other
- [ ] Suggest relevant actions:
  - [ ] Save to collection
  - [ ] Set reminder
  - [ ] Add to calendar
- [ ] Create LinkPreview component

Acceptance Criteria:
- URLs detected automatically
- Metadata extracted correctly
- AI summary generated
- Actions suggested appropriately
```

---

### Issue #26: Implement Save Link Action
```
Title: Build "save link" agent action

Labels: priority:critical, type:feature, area:agent

Description:
Allow agent to save links to user's collections.

Tasks:
- [ ] Parse "save this" / "save link" intents
- [ ] Determine appropriate collection:
  - [ ] Job posting → Jobs
  - [ ] Article → Reading List
  - [ ] Tool/product → Tools
  - [ ] Or ask user
- [ ] Create saved_item record
- [ ] Log agent_action
- [ ] Confirm to user
- [ ] Allow collection override

Acceptance Criteria:
- "Save this link" works
- Correct collection chosen
- Action logged
- User confirmation shown
```

---

### Issue #27: Implement Reminder Action
```
Title: Build reminder creation feature

Labels: priority:high, type:feature, area:agent, area:backend

Description:
Allow agent to create reminders for users.

Tasks:
- [ ] Parse reminder intents:
  - [ ] "Remind me tomorrow"
  - [ ] "Remind me at 3pm"
  - [ ] "Remind me next week"
- [ ] Parse date/time from natural language
- [ ] Create reminder record
- [ ] Set up reminder delivery:
  - [ ] In-app notification
  - [ ] Email (optional)
  - [ ] SMS (if enabled)
- [ ] Log agent_action
- [ ] Build reminders list view

Acceptance Criteria:
- Natural language parsing works
- Reminders created correctly
- Reminders delivered on time
```

---

### Issue #28: Implement Calendar Action
```
Title: Build calendar event creation feature

Labels: priority:high, type:feature, area:agent, area:integrations

Description:
Allow agent to create calendar events.

Tasks:
- [ ] Set up Google Calendar OAuth
- [ ] Parse calendar intents:
  - [ ] "Add to calendar"
  - [ ] "Schedule this"
  - [ ] Event name, date, time extraction
- [ ] Create calendar event via API
- [ ] Log agent_action
- [ ] Confirm with event details
- [ ] Handle no calendar connected

Acceptance Criteria:
- Google Calendar OAuth works
- Events created successfully
- Correct date/time parsed
- Handles disconnected state
```

---

### Issue #29: Create Agent API Routes
```
Title: Build all agent API endpoints

Labels: priority:critical, type:feature, area:backend

Description:
Create the API routes for agent functionality.

Tasks:
- [ ] POST /api/agent/chat
  - [ ] Process message
  - [ ] Call Cerebras API
  - [ ] Execute actions
  - [ ] Return response
- [ ] GET /api/agent/actions
  - [ ] Pagination
  - [ ] Filtering
- [ ] GET /api/agent/settings
- [ ] PATCH /api/agent/settings
- [ ] POST /api/agent/analyze-link
- [ ] Implement action handlers:
  - [ ] save_link
  - [ ] create_reminder
  - [ ] create_calendar_event
  - [ ] summarize

Acceptance Criteria:
- All endpoints functional
- Actions execute correctly
- Errors handled properly
```

---

### Issue #30: Set Up Twilio SMS Integration
```
Title: Integrate Twilio for SMS messaging

Labels: priority:high, type:feature, area:integrations

Description:
Allow users to interact with agent via SMS.

Tasks:
- [ ] Create Twilio account and phone number
- [ ] Install twilio package
- [ ] Create SMS sending function
- [ ] Create webhook: POST /api/agent/webhook/sms
- [ ] Parse incoming messages
- [ ] Route to agent chat handler
- [ ] Send response via SMS
- [ ] Associate phone with user
- [ ] Handle errors

Acceptance Criteria:
- SMS sends successfully
- Webhook receives messages
- Agent responds via SMS
- User association works
```

---

### Issue #31: Create Action Classification System
```
Title: Build intent classification for agent

Labels: priority:high, type:feature, area:agent

Description:
Create system to classify user intents accurately.

Tasks:
- [ ] Define intent categories:
  - [ ] save_link
  - [ ] create_reminder
  - [ ] create_calendar_event
  - [ ] search_feed
  - [ ] summarize
  - [ ] draft_message
  - [ ] general_chat
- [ ] Create classification prompt
- [ ] Extract entities:
  - [ ] URLs
  - [ ] Dates/times
  - [ ] People names
  - [ ] Topics
- [ ] Route to appropriate handler
- [ ] Handle ambiguous intents

Acceptance Criteria:
- Intents classified accurately
- Entities extracted correctly
- Appropriate handlers called
```

---

### Issue #32: Build Proactive Agent Features
```
Title: Implement proactive agent suggestions

Labels: priority:medium, type:feature, area:agent

Description:
Allow agent to proactively suggest actions.

Tasks:
- [ ] Daily digest:
  - [ ] Summarize saved items
  - [ ] List pending reminders
  - [ ] Upcoming calendar events
- [ ] Smart suggestions:
  - [ ] "You saved 3 jobs. Want to draft applications?"
  - [ ] "Connection posted about X. Want a summary?"
- [ ] Create notification system
- [ ] Schedule proactive checks
- [ ] Respect proactivity settings

Acceptance Criteria:
- Proactive messages trigger
- Respect user settings
- Suggestions are relevant
```

---

## M5: Social Layer (Issues #33-40)

### Issue #33: Build Feed Page
```
Title: Create the main social feed

Labels: priority:high, type:feature, area:frontend

Description:
Build the social feed showing posts from connections.

Tasks:
- [ ] Create /dashboard/feed page
- [ ] Build feed tabs:
  - [ ] For You
  - [ ] Following
  - [ ] Topics
- [ ] Create PostCard component:
  - [ ] Avatar + name + verified badge
  - [ ] Post content
  - [ ] Link preview (if link post)
  - [ ] Engagement buttons
  - [ ] Timestamp
- [ ] Fetch posts from API
- [ ] Implement infinite scroll
- [ ] Add pull to refresh
- [ ] Show empty state

Acceptance Criteria:
- Feed loads posts
- Tabs filter correctly
- Infinite scroll works
- Responsive layout
```

---

### Issue #34: Implement Create Post Feature
```
Title: Build post creation functionality

Labels: priority:high, type:feature, area:frontend, area:backend

Description:
Allow users to create new posts.

Tasks:
- [ ] Create API route: POST /api/posts
- [ ] Build CreatePostModal:
  - [ ] Text input (500 char limit)
  - [ ] Post type selector
  - [ ] Link URL input (for link posts)
  - [ ] Topic tags
- [ ] Auto-generate link preview
- [ ] Validate post content
- [ ] Handle rate limiting
- [ ] Show success confirmation

Acceptance Criteria:
- Posts create successfully
- Link preview generates
- Character limit enforced
- Rate limit works
```

---

### Issue #35: Build Post Engagement Features
```
Title: Implement likes and comments

Labels: priority:high, type:feature, area:frontend, area:backend

Description:
Add engagement features to posts.

Tasks:
- [ ] Like functionality:
  - [ ] POST /api/posts/:id/like
  - [ ] DELETE /api/posts/:id/like
  - [ ] Update like count
  - [ ] Show like state
- [ ] Comment functionality:
  - [ ] POST /api/posts/:id/comments
  - [ ] GET /api/posts/:id/comments
  - [ ] Build comments UI
  - [ ] Threaded replies (max 3 levels)
- [ ] Share functionality:
  - [ ] Copy link
  - [ ] Share to other platforms

Acceptance Criteria:
- Likes toggle correctly
- Comments post and display
- Counts update in real-time
```

---

### Issue #36: Implement Connections System
```
Title: Build connection request system

Labels: priority:high, type:feature, area:frontend, area:backend

Description:
Allow users to connect with each other.

Tasks:
- [ ] Create API routes:
  - [ ] GET /api/connections
  - [ ] POST /api/connections
  - [ ] PATCH /api/connections/:id (accept/decline)
  - [ ] DELETE /api/connections/:id
- [ ] Build UI:
  - [ ] Connect button on profiles
  - [ ] Connection requests list
  - [ ] Connections list
- [ ] Handle states:
  - [ ] Not connected
  - [ ] Pending (sent)
  - [ ] Pending (received)
  - [ ] Connected
- [ ] Update trust score on connection

Acceptance Criteria:
- Can send connection requests
- Can accept/decline
- States display correctly
- Trust score updates
```

---

### Issue #37: Build Messages System
```
Title: Create direct messaging feature

Labels: priority:medium, type:feature, area:frontend, area:backend

Description:
Allow users to message their connections.

Tasks:
- [ ] Create API routes:
  - [ ] GET /api/messages
  - [ ] GET /api/messages/:userId
  - [ ] POST /api/messages/:userId
- [ ] Build Messages page:
  - [ ] Conversations list
  - [ ] Message thread view
  - [ ] Message input
- [ ] Only allow messaging connections
- [ ] Mark messages as read
- [ ] Real-time updates (Supabase Realtime)

Acceptance Criteria:
- Can message connections
- Real-time delivery
- Read receipts work
- Non-connections blocked
```

---

### Issue #38: Create Post API Routes
```
Title: Build all post-related API endpoints

Labels: priority:high, type:feature, area:backend

Description:
Create the API routes for posts and feed.

Tasks:
- [ ] GET /api/feed
  - [ ] Filter by type (for_you, following, topics)
  - [ ] Pagination
  - [ ] Include user data
- [ ] POST /api/posts
- [ ] GET /api/posts/:id
- [ ] DELETE /api/posts/:id
- [ ] POST /api/posts/:id/like
- [ ] DELETE /api/posts/:id/like
- [ ] GET /api/posts/:id/comments
- [ ] POST /api/posts/:id/comments
- [ ] Input validation
- [ ] Authorization checks

Acceptance Criteria:
- All endpoints functional
- Proper authorization
- Validation in place
```

---

### Issue #39: Build AI Feed Summary Feature
```
Title: Implement AI-powered feed summarization

Labels: priority:medium, type:feature, area:agent

Description:
Add AI summaries to the feed experience.

Tasks:
- [ ] "Summarize today's posts" agent command
- [ ] Daily digest generation
- [ ] Topic-based summaries
- [ ] Link content summaries in feed
- [ ] Create FeedSummaryCard component
- [ ] "What did X post?" command

Acceptance Criteria:
- Feed summaries generate
- Link summaries show
- Commands work in agent
```

---

### Issue #40: Implement Post Reporting
```
Title: Build content reporting system

Labels: priority:medium, type:feature, area:frontend, area:backend

Description:
Allow users to report inappropriate content.

Tasks:
- [ ] Create reports table
- [ ] Create API route: POST /api/posts/:id/report
- [ ] Build report modal:
  - [ ] Report reason selection
  - [ ] Additional comments
- [ ] Store reports
- [ ] (Future) Admin review queue

Acceptance Criteria:
- Users can report posts
- Reports stored in database
- Confirmation shown
```

---

## M6: Polish & Deploy (Issues #41-47)

### Issue #41: Add Loading and Empty States
```
Title: Create loading skeletons and empty states

Labels: priority:high, type:feature, area:frontend

Description:
Add proper loading and empty states throughout the app.

Tasks:
- [ ] Create Skeleton components:
  - [ ] PostSkeleton
  - [ ] ProfileSkeleton
  - [ ] ActionSkeleton
  - [ ] StatCardSkeleton
- [ ] Create empty states:
  - [ ] No posts
  - [ ] No connections
  - [ ] No saved items
  - [ ] No agent actions
- [ ] Add loading states to all pages
- [ ] Add error boundaries

Acceptance Criteria:
- All pages have loading states
- Empty states are friendly
- Error handling works
```

---

### Issue #42: Implement Error Handling
```
Title: Add comprehensive error handling

Labels: priority:high, type:feature, area:frontend, area:backend

Description:
Implement consistent error handling across the app.

Tasks:
- [ ] Create error response format
- [ ] Create error codes (see SPEC.md)
- [ ] Build ErrorBoundary component
- [ ] Create error pages:
  - [ ] 404 Not Found
  - [ ] 500 Server Error
  - [ ] 403 Forbidden
- [ ] Add toast notifications for errors
- [ ] Log errors to console/service
- [ ] Handle API errors gracefully

Acceptance Criteria:
- Errors display user-friendly messages
- Error pages styled correctly
- Errors logged for debugging
```

---

### Issue #43: Add Animations and Transitions
```
Title: Polish UI with animations

Labels: priority:medium, type:feature, area:frontend

Description:
Add subtle animations to improve UX.

Tasks:
- [ ] Page transitions
- [ ] Modal open/close animations
- [ ] List item stagger animations
- [ ] Button hover/press states
- [ ] Loading spinner animations
- [ ] Skeleton shimmer effect
- [ ] Toast enter/exit animations
- [ ] Sidebar collapse animation

Acceptance Criteria:
- Animations feel smooth
- Not distracting
- Consistent throughout app
```

---

### Issue #44: Implement SEO and Meta Tags
```
Title: Add SEO optimization

Labels: priority:medium, type:feature, area:frontend

Description:
Optimize the app for search engines and social sharing.

Tasks:
- [ ] Create metadata utilities
- [ ] Add Open Graph tags:
  - [ ] Title
  - [ ] Description
  - [ ] Image
- [ ] Add Twitter Card tags
- [ ] Create og-image generation
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Profile pages: dynamic meta

Acceptance Criteria:
- Social shares show previews
- SEO meta present on all pages
```

---

### Issue #45: Mobile Responsiveness Audit
```
Title: Ensure full mobile responsiveness

Labels: priority:high, type:chore, area:frontend

Description:
Audit and fix all mobile responsiveness issues.

Tasks:
- [ ] Test all pages on mobile viewport
- [ ] Fix sidebar on mobile
- [ ] Fix agent chat on mobile
- [ ] Fix feed on mobile
- [ ] Fix profile on mobile
- [ ] Fix modals on mobile
- [ ] Test touch interactions
- [ ] Fix any overflow issues

Acceptance Criteria:
- All pages work on mobile
- No horizontal scrolling
- Touch-friendly interactions
```

---

### Issue #46: Performance Optimization
```
Title: Optimize app performance

Labels: priority:medium, type:chore, area:frontend, area:backend

Description:
Improve app performance and loading times.

Tasks:
- [ ] Implement code splitting
- [ ] Add image optimization
- [ ] Enable caching where appropriate
- [ ] Optimize database queries
- [ ] Add React Query caching
- [ ] Lazy load components
- [ ] Minimize bundle size
- [ ] Run Lighthouse audit

Acceptance Criteria:
- Lighthouse score > 80
- Fast initial load
- Smooth interactions
```

---

### Issue #47: Deploy to Vercel
```
Title: Deploy application to production

Labels: priority:critical, type:chore

Description:
Deploy the application to Vercel for production.

Tasks:
- [ ] Create Vercel project
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Configure build settings
- [ ] Set up preview deployments
- [ ] Test production build
- [ ] Monitor for errors
- [ ] Create deployment documentation

Acceptance Criteria:
- App deployed and accessible
- Custom domain working
- Environment variables set
- No production errors
```

---

## Issue Template

For creating new issues, use this template:

```markdown
Title: [Clear, action-oriented title]

Labels: [priority], [type], [area(s)]

Description:
[Clear description of what needs to be done]

Tasks:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

Acceptance Criteria:
- Criterion 1
- Criterion 2
- Criterion 3

Dependencies: (if any)
- Issue #X must be completed first

Notes:
[Any additional context or technical notes]
```

---

## Automation Script

To create these issues in GitHub, you can use the GitHub CLI:

```bash
#!/bin/bash
# create-issues.sh

# Example for one issue
gh issue create \
  --title "Initialize Next.js 14 project with TypeScript and Tailwind" \
  --body "$(cat issue-1.md)" \
  --label "priority:critical,type:chore,area:frontend" \
  --milestone "M1: Project Setup"
```

---

*End of Issues Document*
