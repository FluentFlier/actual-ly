# Actual.ly — Implementation Plan

> Step-by-step guide for building the MVP

---

## Overview

This document provides a day-by-day breakdown of how to build Actual.ly MVP.

**Timeline:** 4 weeks (25 working days)  
**Daily Commitment:** 4-6 hours

---

## Week 1: Foundation (Days 1-5)

### Day 1: Project Setup

**Morning (2-3 hrs)**
- [ ] Create GitHub repository
- [ ] Initialize Next.js 14 with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up folder structure

**Afternoon (2-3 hrs)**
- [ ] Install shadcn/ui
- [ ] Install dependencies (framer-motion, lucide-react, zustand)
- [ ] Create .env files
- [ ] Test that everything runs

**Commands:**
```bash
npx create-next-app@latest actual-ly --typescript --tailwind --eslint --app --src-dir
cd actual-ly
npx shadcn@latest init
npm install framer-motion lucide-react zustand @tanstack/react-query
```

---

### Day 2: Database & Auth

**Morning (2-3 hrs)**
- [ ] Create Supabase project
- [ ] Run database schema SQL
- [ ] Set up RLS policies
- [ ] Configure Supabase client in Next.js

**Afternoon (2-3 hrs)**
- [ ] Create Clerk application
- [ ] Install and configure @clerk/nextjs
- [ ] Create auth middleware
- [ ] Style Clerk components

**Files to create:**
```
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/middleware.ts
src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
```

---

### Day 3: Design System

**Morning (2-3 hrs)**
- [ ] Define colors in tailwind.config.ts
- [ ] Set up CSS variables for theming
- [ ] Configure next-themes for dark mode
- [ ] Create ThemeToggle component

**Afternoon (2-3 hrs)**
- [ ] Create base components:
  - Logo
  - VerifiedBadge
  - TrustScoreBar
  - StatCard
  - LoadingSpinner
- [ ] Test components in isolation

**Color palette:**
```typescript
// tailwind.config.ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  border: 'hsl(var(--border))',
  primary: 'hsl(var(--primary))',
  muted: 'hsl(var(--muted))',
  accent: '#16a34a', // Actual.ly green
}
```

---

### Day 4: Layouts

**Morning (2-3 hrs)**
- [ ] Create PublicLayout
- [ ] Create Navbar (public)
- [ ] Create Footer

**Afternoon (2-3 hrs)**
- [ ] Create DashboardLayout
- [ ] Create Sidebar with navigation
- [ ] Create DashboardHeader
- [ ] Make layouts responsive

**Layout structure:**
```
src/app/(public)/layout.tsx    → PublicLayout
src/app/(dashboard)/layout.tsx → DashboardLayout
src/components/layout/
├── Navbar.tsx
├── Footer.tsx
├── Sidebar.tsx
├── DashboardHeader.tsx
└── MobileNav.tsx
```

---

### Day 5: Landing Page

**Full Day (4-6 hrs)**
- [ ] Build hero section
- [ ] Username claim input with validation
- [ ] About section
- [ ] Animations with Framer Motion
- [ ] Mobile responsiveness
- [ ] Connect to auth flow

**Key components:**
```
src/app/(public)/page.tsx
src/components/features/UsernameInput.tsx
```

---

## Week 2: Identity & Dashboard (Days 6-10)

### Day 6: Username Flow

**Morning (2-3 hrs)**
- [ ] Create POST /api/auth/claim-username
- [ ] Username validation logic
- [ ] Availability checking (debounced)

**Afternoon (2-3 hrs)**
- [ ] Real-time validation UI
- [ ] Error states
- [ ] Success flow → verification

---

### Day 7: Verification (Clerk)

**Morning (2-3 hrs)**
- [ ] Create verification page UI
- [ ] Require phone + email verification via Clerk

**Afternoon (2-3 hrs)**
- [ ] Update user in database
- [ ] Calculate trust score
- [ ] Redirect to dashboard
- [ ] Success modal

---

### Day 8: Profile Page

**Full Day (4-6 hrs)**
- [ ] Create /[username]/page.tsx
- [ ] Fetch user by username
- [ ] Display all profile info
- [ ] Trust score visualization
- [ ] Agent status card
- [ ] 404 handling
- [ ] OG meta tags

---

### Day 9: Dashboard Core

**Morning (2-3 hrs)**
- [ ] Dashboard overview page
- [ ] Stats cards (real data)
- [ ] Quick actions section

**Afternoon (2-3 hrs)**
- [ ] Recent activity feed
- [ ] Connect to real data
- [ ] Loading states

---

### Day 10: Collections & Saved Items

**Full Day (4-6 hrs)**
- [ ] Create collections API routes
- [ ] Create saved items API routes
- [ ] Build collections sidebar
- [ ] Build saved items list
- [ ] CRUD operations

---

## Week 3: Agent (Days 11-15)

### Day 11: Cerebras Integration

**Full Day (4-6 hrs)**
- [ ] Create AI client wrapper
- [ ] Define system prompts
- [ ] Test basic chat completion
- [ ] Error handling

**System prompt structure:**
```typescript
const SYSTEM_PROMPT = `You are an AI assistant for Actual.ly.
You help users:
- Analyze and save links
- Create reminders
- Add events to calendar
- Summarize content

Always respond helpfully and concisely.
When you need to take an action, respond with a JSON block.`;
```

---

### Day 12: Agent Chat UI

**Full Day (4-6 hrs)**
- [ ] Create /dashboard/agent page
- [ ] Build chat message list
- [ ] User and agent message bubbles
- [ ] Message input
- [ ] Typing indicator
- [ ] Scroll behavior

---

### Day 13: Link Analysis

**Morning (2-3 hrs)**
- [ ] URL detection in messages
- [ ] Metadata extraction (title, description, image)
- [ ] AI summary generation

**Afternoon (2-3 hrs)**
- [ ] Link type classification
- [ ] Action suggestions
- [ ] LinkPreview component

---

### Day 14: Agent Actions

**Full Day (4-6 hrs)**
- [ ] Save link action
- [ ] Create reminder action
- [ ] Intent classification
- [ ] Action logging
- [ ] Actions history page

---

### Day 15: Agent Polish

**Full Day (4-6 hrs)**
- [ ] Agent settings page
- [ ] Conversation persistence
- [ ] Edge cases handling
- [ ] Proactive suggestions (basic)
- [ ] Testing all flows

---

## Week 4: Social & Deploy (Days 16-25)

### Day 16-17: Feed

**Day 16**
- [ ] Create posts table operations
- [ ] Feed API route with pagination
- [ ] Feed page with tabs

**Day 17**
- [ ] PostCard component
- [ ] Infinite scroll
- [ ] Empty states

---

### Day 18: Create Post

**Full Day (4-6 hrs)**
- [ ] Create post modal
- [ ] Post types (text, link)
- [ ] Link preview generation
- [ ] Rate limiting
- [ ] Success feedback

---

### Day 19: Engagement

**Full Day (4-6 hrs)**
- [ ] Like functionality
- [ ] Comments UI
- [ ] Comment posting
- [ ] Real-time updates (optional)

---

### Day 20: Connections

**Full Day (4-6 hrs)**
- [ ] Connection request API
- [ ] Accept/decline flow
- [ ] Connect button states
- [ ] Connections list

---

### Day 21: Messages (Basic)

**Full Day (4-6 hrs)**
- [ ] Messages API
- [ ] Conversations list
- [ ] Message thread view
- [ ] Send message

---

### Day 22: Insights

**Full Day (4-6 hrs)**
- [ ] Insights overview page
- [ ] Time saved calculation
- [ ] Action charts
- [ ] Trust score breakdown

---

### Day 23: Polish - Loading States

**Full Day (4-6 hrs)**
- [ ] Skeleton components
- [ ] All loading states
- [ ] Empty states
- [ ] Error boundaries

---

### Day 24: Polish - Mobile & Animations

**Full Day (4-6 hrs)**
- [ ] Mobile responsiveness audit
- [ ] Fix all mobile issues
- [ ] Add page transitions
- [ ] Polish animations

---

### Day 25: Deploy

**Full Day (4-6 hrs)**
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Deploy and test
- [ ] Fix any production issues
- [ ] Documentation

---

## Key Files Reference

### API Routes
```
src/app/api/
├── auth/
│   ├── claim-username/route.ts
│   └── verify-world-id/route.ts
├── users/
│   └── [username]/
│       ├── route.ts
│       ├── posts/route.ts
│       └── connections/route.ts
├── posts/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       ├── like/route.ts
│       └── comments/route.ts
├── agent/
│   ├── chat/route.ts
│   ├── actions/route.ts
│   └── settings/route.ts
├── collections/route.ts
├── saved/route.ts
├── connections/route.ts
├── messages/route.ts
└── insights/route.ts
```

### Pages
```
src/app/
├── (public)/
│   ├── page.tsx                    # Landing
│   └── [username]/page.tsx         # Profile
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   └── verify/page.tsx
└── (dashboard)/
    └── dashboard/
        ├── page.tsx                # Overview
        ├── feed/page.tsx
        ├── messages/page.tsx
        ├── agent/
        │   ├── page.tsx            # Chat
        │   ├── actions/page.tsx
        │   └── settings/page.tsx
        ├── insights/
        │   ├── page.tsx
        │   ├── trust/page.tsx
        │   └── network/page.tsx
        └── settings/
            ├── profile/page.tsx
            ├── integrations/page.tsx
            └── privacy/page.tsx
```

---

## Testing Checklist

Before demo, test:

- [ ] Landing → Username claim → Verification → Dashboard flow
- [ ] Profile page loads correctly
- [ ] Agent chat works end-to-end
- [ ] Link analysis and save works
- [ ] Reminders create correctly
- [ ] Feed shows posts
- [ ] Mobile works on all pages
- [ ] Dark mode works
- [ ] No console errors
- [ ] Performance is acceptable

---

## Demo Script

```
1. "This is Actual.ly - a social platform for verified humans."

2. Show landing page
   - "No bots, no spam, no fake accounts."

3. Claim username flow
   - "You claim your unique username..."

4. Verification (real)
   - "...and verify your phone and email with Clerk."

5. Profile page
   - "Your verified profile with trust score."

6. Agent demo
   - Share a job link
   - "My AI agent analyzes it..."
   - "Remind me to apply tomorrow"
   - "Done. It's in my calendar."

7. Dashboard
   - "Everything tracked. Time saved."

8. Feed (brief)
   - "And a social feed of only verified humans."

9. Close
   - "That's Actual.ly. Verified humans, real posts, AI agents."
```

---

## Troubleshooting

### Common Issues

**Supabase connection fails**
- Check environment variables
- Ensure RLS policies allow access

**Clerk auth redirect loops**
- Check middleware.ts matcher
- Verify publishable key

**Cerebras API errors**
- Check API key
- Verify rate limits
- Check system prompt length

**Build fails on Vercel**
- Check for TypeScript errors
- Verify all env vars set
- Check API route exports

---

*Good luck building! 🚀*
