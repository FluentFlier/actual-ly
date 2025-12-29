# Actual.ly — Product Specification

> **Version:** 1.0  
> **Last Updated:** December 29, 2025  
> **Status:** MVP Planning

---

## Executive Summary

**Actual.ly** is a social platform where every human is verified, every post is real, and everyone has an AI agent working for them.

### Core Thesis
Verification of identity and actual truth is the way to create a new foundational layer for the internet that benefits all humans.

### One-Liner
"A social platform where every human is verified, every post is real, and everyone has an AI agent working for them."

### Key Differentiators
- **Verified Identity:** Phone + email verification ensures one human = one account
- **AI Agent:** Every user gets a personal AI assistant that actually does things
- **No Bots:** Trust scores and verification prevent spam/manipulation
- **Actual Truth:** Every post comes from a verified human

---

## Table of Contents

1. [Core Pillars](#1-core-pillars)
2. [Identity Layer](#2-identity-layer)
3. [Social Layer](#3-social-layer)
4. [AI Agent Layer](#4-ai-agent-layer)
5. [Dashboard (Control Room)](#5-dashboard-control-room)
6. [Insights Layer](#6-insights-layer)
7. [Tech Stack](#7-tech-stack)
8. [Database Schema](#8-database-schema)
9. [API Endpoints](#9-api-endpoints)
10. [MVP Scope](#10-mvp-scope)
11. [Future Roadmap](#11-future-roadmap)

---

## 1. Core Pillars

```
┌─────────────────────────────────────────────────────────────────┐
│                        ACTUAL.LY                                │
├─────────────┬─────────────┬─────────────┬─────────────┬────────┤
│  IDENTITY   │   SOCIAL    │    AGENT    │  DASHBOARD  │INSIGHTS│
│             │             │             │             │        │
│ Phone Verify│ Feed        │ Chat        │ Control     │ Stats  │
│ Verification│ Profiles    │ Actions     │ Settings    │ Trends │
│ Trust Score │ Connections │ Integtic    │ History     │ Health │
└─────────────┴─────────────┴─────────────┴─────────────┴────────┘
```

---

## 2. Identity Layer

### 2.1 Verification Flow

```
User arrives → Claim username (actual.ly/anirudh)
            → Verify phone + email (Clerk)
            → Get "Actual Human" badge ✓
            → Unlock all features
```

### 2.2 Username Requirements
- Length: 10-50 characters
- Allowed: lowercase letters, numbers, underscores
- Must be unique
- Cannot be changed after verification (prevents impersonation)

### 2.3 Trust Score System

Trust Score is a 0-100 metric indicating account legitimacy.

| Factor | Points | Max |
|--------|--------|-----|
| Phone verified (Actual Human badge) | +50 | 50 |
| Email verified | +10 | 10 |
| Account age (per month) | +2 | 20 |
| Connections with verified users | +1 each | 10 |
| Content engagement (per 100) | +1 | 10 |
| **Total** | — | **100** |

### 2.4 Trust Score Thresholds

| Score | Level | Permissions |
|-------|-------|-------------|
| 0-19 | Unverified | View only, cannot post |
| 20-49 | Basic | Can post, limited features |
| 50-79 | Trusted | Full features, agent access |
| 80-100 | Verified | All features + priority support |

### 2.5 Profile Page Structure

**URL Pattern:** `actual.ly/{username}`

**Profile Components:**
- Avatar (from Clerk or custom upload)
- Display name
- Username
- Verification badge
- Trust score with breakdown
- Bio (max 160 characters)
- External links (max 5)
- Agent status card
- Action buttons: Message, Connect, Share Agent

**Profile Data Model:**
```typescript
interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  links: ExternalLink[];
  trustScore: number;
  isVerified: boolean;
  verifiedAt: Date | null;
  agentEnabled: boolean;
  agentActionsCount: number;
  connectionsCount: number;
  createdAt: Date;
}

interface ExternalLink {
  type: 'website' | 'github' | 'linkedin' | 'twitter' | 'other';
  url: string;
  label: string;
}
```

---

## 3. Social Layer

### 3.1 Feed Types

| Feed | Description | Default |
|------|-------------|---------|
| **For You** | AI-curated from connections + interests | ✓ |
| **Verified Only** | 100% verified humans only | |
| **Following** | People you connect with | |
| **Topics** | Hashtag-based filtering | |

### 3.2 Post Types

| Type | Icon | Description |
|------|------|-------------|
| Text | 📝 | Standard text posts (max 500 chars) |
| Link | 🔗 | Auto-previewed, AI-summarized links |
| Poll | 📊 | Verified votes only (no manipulation) |
| Job | 💼 | Verified companies + applicants |
| Collab | 🤝 | Find co-founders, teammates |
| Question | ❓ | Community answers, AI-assisted |

### 3.3 Post Data Model

```typescript
interface Post {
  id: string;
  userId: string;
  type: 'text' | 'link' | 'poll' | 'job' | 'collab' | 'question';
  content: string;
  
  // For link posts
  linkUrl?: string;
  linkPreview?: {
    title: string;
    description: string;
    image: string;
    domain: string;
  };
  aiSummary?: string;
  
  // For poll posts
  pollOptions?: PollOption[];
  pollEndsAt?: Date;
  
  // Engagement
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  
  // Metadata
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface PollOption {
  id: string;
  text: string;
  votesCount: number;
}
```

### 3.4 Anti-Spam Features

| Feature | Implementation |
|---------|----------------|
| Rate limiting | Max 10 posts/day per user |
| Duplicate detection | AI flags similar content within 24h |
| Engagement gating | Need trust score > 20 to post |
| Report system | Users can flag, humans review |
| Shadow detection | AI detects coordinated behavior |

### 3.5 Connections System

- Connections are mutual (both must accept)
- Request → Accept/Decline flow
- Can message only connections (spam prevention)
- Connection count affects trust score

```typescript
interface Connection {
  id: string;
  requesterId: string;
  requesteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  acceptedAt: Date | null;
}
```

### 3.6 Comments System

- Threaded comments (max 3 levels deep)
- Only verified users can comment
- Edit window: 5 minutes
- Delete: anytime (shows "[deleted]")

---

## 4. AI Agent Layer

### 4.1 Agent Overview

Every verified user gets a personal AI agent that:
- Lives in their messages (SMS, iMessage, WhatsApp, Web)
- Analyzes content they share
- Performs actions on their behalf
- Learns their preferences over time

### 4.2 Agent Capabilities

#### Chat Commands

| Command | Action |
|---------|--------|
| "Remind me to [X] [when]" | Creates reminder |
| "Save this link" | Saves to collections |
| "What did [person] post?" | Summarizes their feed |
| "Draft a reply to this" | Writes response |
| "Add to calendar" | Creates calendar event |
| "Research [topic/company]" | Pulls relevant data |
| "Find jobs like this" | Searches job boards |
| "Summarize my DMs" | TL;DR of messages |

#### Proactive Actions

The agent can proactively:
- Suggest actions based on saved links
- Alert about activity from connections
- Remind about incomplete tasks
- Summarize daily/weekly activity

### 4.3 Agent Access Points

| Channel | Implementation |
|---------|----------------|
| SMS | Twilio phone number |
| iMessage | Via email-to-iMessage |
| WhatsApp | Twilio WhatsApp API |
| Web | Built-in chat interface |
| Desktop | Cmd+Shift+A hotkey (future) |
| Voice | "Hey Actual" (future) |

### 4.4 Agent Settings

```typescript
interface AgentSettings {
  tone: 'casual' | 'professional' | 'minimal';
  proactivity: 'high' | 'medium' | 'low';
  verbosity: 'detailed' | 'concise' | 'tldr';
  workHours: {
    enabled: boolean;
    start: string; // "09:00"
    end: string;   // "18:00"
    timezone: string;
  };
  enabledChannels: {
    sms: boolean;
    whatsapp: boolean;
    web: boolean;
  };
}
```

### 4.5 Agent Actions Data Model

```typescript
interface AgentAction {
  id: string;
  userId: string;
  actionType: 'reminder' | 'save_link' | 'calendar' | 'draft' | 'research' | 'summary';
  inputText: string;
  outputText: string;
  integration: string | null;
  metadata: Record<string, any>;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt: Date | null;
}
```

### 4.6 Integrations

| Integration | Capabilities | OAuth |
|-------------|--------------|-------|
| Google Calendar | Create, read, update events | ✓ |
| Gmail | Read, draft, send emails | ✓ |
| Notion | Create pages, add to databases | ✓ |
| Linear | Create issues, update status | ✓ |
| Slack | Send messages to channels | ✓ |
| Twitter/X | Cross-post, read timeline | ✓ |
| LinkedIn | Cross-post, job search | ✓ |
| GitHub | Track repos, create issues | ✓ |

```typescript
interface UserIntegration {
  id: string;
  userId: string;
  provider: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
  connectedAt: Date;
}
```

---

## 5. Dashboard (Control Room)

### 5.1 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  actual.ly                    🔍 Search    🔔 3    👤 anirudh   │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  DASHBOARD   │   Main Content Area                              │
│  ──────────  │                                                  │
│  Overview    │                                                  │
│  Feed        │                                                  │
│  Messages    │                                                  │
│              │                                                  │
│  AGENT       │                                                  │
│  ──────────  │                                                  │
│  Chat        │                                                  │
│  Actions     │                                                  │
│  Settings    │                                                  │
│              │                                                  │
│  INSIGHTS    │                                                  │
│  ──────────  │                                                  │
│  Analytics   │                                                  │
│  Trust Score │                                                  │
│  Network     │                                                  │
│              │                                                  │
│  SETTINGS    │                                                  │
│  ──────────  │                                                  │
│  Profile     │                                                  │
│  Integrations│                                                  │
│  Privacy     │                                                  │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

### 5.2 Dashboard Pages

#### Overview
- Stats cards: Tasks done, Links saved, Agent actions
- Recent agent activity feed
- Quick actions: Ask Agent, New Post, Check Feed, Invite

#### Agent Chat
- Full chat interface with agent
- Message history
- Quick action buttons

#### Agent Actions
- Chronological list of all agent actions
- Filter by type, date, status
- Search functionality
- Export to CSV

#### Saved Links / Collections
- Organize saved links into collections
- Default collections: Jobs, Reading List, Tools, People
- Custom collections
- Status tracking: Saved, In Progress, Done

#### Integrations
- List of available integrations
- Connection status
- Connect/Disconnect buttons
- Permission scopes display

### 5.3 Navigation Structure

```typescript
const navigation = [
  {
    section: 'Dashboard',
    items: [
      { name: 'Overview', href: '/dashboard', icon: 'home' },
      { name: 'Feed', href: '/dashboard/feed', icon: 'rss' },
      { name: 'Messages', href: '/dashboard/messages', icon: 'message' },
    ]
  },
  {
    section: 'Agent',
    items: [
      { name: 'Chat', href: '/dashboard/agent', icon: 'bot' },
      { name: 'Actions', href: '/dashboard/agent/actions', icon: 'activity' },
      { name: 'Settings', href: '/dashboard/agent/settings', icon: 'settings' },
    ]
  },
  {
    section: 'Insights',
    items: [
      { name: 'Analytics', href: '/dashboard/insights', icon: 'chart' },
      { name: 'Trust Score', href: '/dashboard/insights/trust', icon: 'shield' },
      { name: 'Network', href: '/dashboard/insights/network', icon: 'users' },
    ]
  },
  {
    section: 'Settings',
    items: [
      { name: 'Profile', href: '/dashboard/settings/profile', icon: 'user' },
      { name: 'Integrations', href: '/dashboard/settings/integrations', icon: 'plug' },
      { name: 'Privacy', href: '/dashboard/settings/privacy', icon: 'lock' },
    ]
  },
];
```

---

## 6. Insights Layer

### 6.1 Personal Analytics

**Time Saved Calculation:**
- Each agent action has estimated time saved
- Reminder: 1 min
- Save link: 30 sec
- Calendar event: 2 min
- Email draft: 5 min
- Research: 10 min

**Metrics Tracked:**
- Total agent actions (daily, weekly, monthly)
- Actions by type breakdown
- Time saved estimate
- Most used integrations
- Peak usage hours

### 6.2 Network Analytics

- Total connections
- New connections this period
- Connection growth rate
- Most active connections
- Network topics distribution

### 6.3 Trust Score Breakdown

Visual breakdown showing:
- Current score with progress bar
- Points from each factor
- How to improve score
- Score history over time

---

## 7. Tech Stack

### 7.1 Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| shadcn/ui | UI components |
| Lucide React | Icons |
| Zustand | State management |
| React Query | Data fetching |

### 7.2 Backend

| Technology | Purpose |
|------------|---------|
| Next.js API Routes | API endpoints |
| Supabase | Database + Realtime |
| Clerk | Authentication + phone/email verification |

### 7.3 AI & Integrations

| Technology | Purpose |
|------------|---------|
| Cerebras API | AI agent brain |
| Twilio | SMS/WhatsApp messaging |
| Google APIs | Calendar, Gmail |
| OAuth 2.0 | Third-party integrations |

### 7.4 Infrastructure

| Technology | Purpose |
|------------|---------|
| Vercel | Hosting + Edge functions |
| Supabase | Postgres database |
| Upstash | Redis for rate limiting |
| Resend | Transactional emails |

---

## 8. Database Schema

### 8.1 Complete Schema

```sql
-- =====================
-- USERS & IDENTITY
-- =====================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio VARCHAR(160),
  
  -- Verification
  world_id_hash VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- Trust Score
  trust_score INTEGER DEFAULT 0,
  
  -- Agent Settings
  agent_settings JSONB DEFAULT '{}',
  agent_enabled BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  url TEXT NOT NULL,
  label VARCHAR(50),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CONNECTIONS
-- =====================

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requestee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  
  UNIQUE(requester_id, requestee_id)
);

-- =====================
-- POSTS & SOCIAL
-- =====================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  
  -- Link posts
  link_url TEXT,
  link_preview JSONB,
  ai_summary TEXT,
  
  -- Poll posts
  poll_options JSONB,
  poll_ends_at TIMESTAMPTZ,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Metadata
  topics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  option_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);

-- =====================
-- AI AGENT
-- =====================

CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  input_text TEXT,
  output_text TEXT,
  integration VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'completed',
  time_saved_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES collections(id),
  url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT,
  ai_summary TEXT,
  status VARCHAR(20) DEFAULT 'saved',
  reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  is_default BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  remind_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INTEGRATIONS
-- =====================

CREATE TABLE user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  metadata JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- =====================
-- MESSAGES
-- =====================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_trust_score ON users(trust_score);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_agent_actions_user_id ON agent_actions(user_id);
CREATE INDEX idx_agent_actions_created_at ON agent_actions(created_at DESC);
CREATE INDEX idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX idx_connections_status ON connections(status);
```

---

## 9. API Endpoints

### 9.1 Authentication

```
POST   /api/auth/sync-profile       # Sync Clerk verification
POST   /api/auth/claim-username     # Claim username
GET    /api/auth/me                 # Get current user
```

### 9.2 Users & Profiles

```
GET    /api/users/:username         # Get user profile
PATCH  /api/users/:username         # Update profile
GET    /api/users/:username/posts   # Get user's posts
GET    /api/users/:username/connections # Get connections
```

### 9.3 Social

```
GET    /api/feed                    # Get feed (with type filter)
POST   /api/posts                   # Create post
GET    /api/posts/:id               # Get post
DELETE /api/posts/:id               # Delete post
POST   /api/posts/:id/like          # Like post
DELETE /api/posts/:id/like          # Unlike post
POST   /api/posts/:id/comments      # Add comment
```

### 9.4 Connections

```
GET    /api/connections             # Get all connections
POST   /api/connections             # Send connection request
PATCH  /api/connections/:id         # Accept/decline
DELETE /api/connections/:id         # Remove connection
```

### 9.5 Agent

```
POST   /api/agent/chat              # Send message to agent
GET    /api/agent/actions           # Get action history
GET    /api/agent/settings          # Get settings
PATCH  /api/agent/settings          # Update settings
POST   /api/agent/webhook/sms       # Twilio SMS webhook
POST   /api/agent/webhook/whatsapp  # Twilio WhatsApp webhook
```

### 9.6 Saved Items & Collections

```
GET    /api/collections             # Get all collections
POST   /api/collections             # Create collection
PATCH  /api/collections/:id         # Update collection
DELETE /api/collections/:id         # Delete collection
GET    /api/saved                   # Get saved items
POST   /api/saved                   # Save item
PATCH  /api/saved/:id               # Update item
DELETE /api/saved/:id               # Delete item
```

### 9.7 Integrations

```
GET    /api/integrations            # Get all integrations status
GET    /api/integrations/:provider/connect    # Start OAuth
GET    /api/integrations/:provider/callback   # OAuth callback
DELETE /api/integrations/:provider            # Disconnect
```

### 9.8 Insights

```
GET    /api/insights/overview       # Get overview stats
GET    /api/insights/actions        # Get action analytics
GET    /api/insights/trust          # Get trust score breakdown
GET    /api/insights/network        # Get network analytics
```

---

## 10. MVP Scope

### 10.1 Phase 1: Core (Week 1)

| Feature | Priority | Status |
|---------|----------|--------|
| Landing page | P0 | 🔲 |
| Username claim flow | P0 | 🔲 |
| Phone + email verification (Clerk) | P0 | 🔲 |
| User profile page | P0 | 🔲 |
| Basic dashboard layout | P0 | 🔲 |
| Database setup | P0 | 🔲 |

### 10.2 Phase 2: Agent (Week 2)

| Feature | Priority | Status |
|---------|----------|--------|
| Agent chat interface | P0 | 🔲 |
| Link analysis | P0 | 🔲 |
| Save to collections | P0 | 🔲 |
| Reminders | P1 | 🔲 |
| Actions history | P1 | 🔲 |

### 10.3 Phase 3: Social (Week 3)

| Feature | Priority | Status |
|---------|----------|--------|
| Feed UI | P1 | 🔲 |
| Create posts | P1 | 🔲 |
| Like/comment | P1 | 🔲 |
| Connections | P1 | 🔲 |

### 10.4 Phase 4: Integrations (Week 4)

| Feature | Priority | Status |
|---------|----------|--------|
| Google Calendar | P1 | 🔲 |
| Twilio SMS | P1 | 🔲 |
| Gmail | P2 | 🔲 |
| Other integrations | P2 | 🔲 |

### 10.5 Deferred (Post-MVP)

- Deeper identity proofs (optional)
- WhatsApp integration
- Desktop app
- Voice commands
- Advanced analytics
- Admin dashboard

---

## 11. Future Roadmap

### Q1 2025
- Launch MVP with core features
- 100 beta users
- Iterate based on feedback

### Q2 2025
- Mobile app (React Native)
- More integrations
- 1,000 users

### Q3 2025
- Deeper identity proofs (optional)
- Advanced agent capabilities
- 10,000 users

### Q4 2025
- Enterprise features
- API for developers
- 100,000 users

---

## Appendix A: Design System

### Colors

```css
/* Light Mode */
--background: #fafafa;
--card: #ffffff;
--border: #e5e5e5;
--text-primary: #0a0a0a;
--text-secondary: #525252;
--text-muted: #a3a3a3;
--accent: #16a34a; /* Green - matches Actual.ly branding */
--accent-hover: #15803d;

/* Dark Mode */
--background: #0a0a0a;
--card: #18181b;
--border: rgba(255,255,255,0.1);
--text-primary: #fafafa;
--text-secondary: #a1a1aa;
--text-muted: #71717a;
--accent: #22c55e;
--accent-hover: #16a34a;
```

### Typography

- Font: Inter or system-ui
- Headings: Semi-bold
- Body: Regular
- Numbers: Tabular figures

### Spacing

- Base unit: 4px
- Card padding: 24px
- Section gap: 32px
- Border radius: 12px (cards), 8px (buttons)

---

## Appendix B: Error Handling

### Error Codes

| Code | Message |
|------|---------|
| AUTH_001 | Not authenticated |
| AUTH_002 | Phone not verified |
| AUTH_003 | Username taken |
| USER_001 | User not found |
| USER_002 | Not verified |
| POST_001 | Rate limit exceeded |
| POST_002 | Content too long |
| AGENT_001 | Agent disabled |
| AGENT_002 | Integration not connected |

---

## Appendix C: Security Considerations

- All API routes require authentication
- Rate limiting on all endpoints
- Phone/email verification managed via Clerk
- OAuth tokens encrypted at rest
- HTTPS only
- Input sanitization
- SQL injection prevention (parameterized queries)

---

*End of Specification*
