#!/bin/bash

# ============================================
# Actual.ly - GitHub Issues Creation Script
# ============================================
# 
# Prerequisites:
#   - GitHub CLI installed (gh)
#   - Authenticated with GitHub (gh auth login)
#   - Repository created (gh repo create actual-ly)
#
# Usage:
#   chmod +x create-issues.sh
#   ./create-issues.sh
#
# ============================================

REPO="actual-ly"  # Change to your repo name

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Creating GitHub Issues for Actual.ly${NC}"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Create Milestones
echo -e "${YELLOW}Creating Milestones...${NC}"

gh api repos/:owner/$REPO/milestones -f title="M1: Project Setup" -f description="Initial project setup and configuration" -f due_on="2025-01-03T00:00:00Z" 2>/dev/null || true
gh api repos/:owner/$REPO/milestones -f title="M2: Identity Layer" -f description="User verification and profiles" -f due_on="2025-01-07T00:00:00Z" 2>/dev/null || true
gh api repos/:owner/$REPO/milestones -f title="M3: Dashboard Core" -f description="Main dashboard and navigation" -f due_on="2025-01-12T00:00:00Z" 2>/dev/null || true
gh api repos/:owner/$REPO/milestones -f title="M4: Agent Core" -f description="AI agent functionality" -f due_on="2025-01-19T00:00:00Z" 2>/dev/null || true
gh api repos/:owner/$REPO/milestones -f title="M5: Social Layer" -f description="Feed, posts, and connections" -f due_on="2025-01-26T00:00:00Z" 2>/dev/null || true
gh api repos/:owner/$REPO/milestones -f title="M6: Polish & Deploy" -f description="Final polish and deployment" -f due_on="2025-01-31T00:00:00Z" 2>/dev/null || true

echo -e "${GREEN}✓ Milestones created${NC}"
echo ""

# Create Labels
echo -e "${YELLOW}Creating Labels...${NC}"

gh label create "priority:critical" --color "b60205" --description "Must have for MVP" 2>/dev/null || true
gh label create "priority:high" --color "d93f0b" --description "Important for MVP" 2>/dev/null || true
gh label create "priority:medium" --color "fbca04" --description "Nice to have" 2>/dev/null || true
gh label create "priority:low" --color "0e8a16" --description "Post-MVP" 2>/dev/null || true
gh label create "type:feature" --color "1d76db" --description "New feature" 2>/dev/null || true
gh label create "type:bug" --color "e11d21" --description "Bug fix" 2>/dev/null || true
gh label create "type:chore" --color "5319e7" --description "Setup, config, maintenance" 2>/dev/null || true
gh label create "type:docs" --color "006b75" --description "Documentation" 2>/dev/null || true
gh label create "area:frontend" --color "c5def5" --description "UI/UX work" 2>/dev/null || true
gh label create "area:backend" --color "bfd4f2" --description "API/Database work" 2>/dev/null || true
gh label create "area:agent" --color "d4c5f9" --description "AI agent work" 2>/dev/null || true
gh label create "area:integrations" --color "fef2c0" --description "Third-party integrations" 2>/dev/null || true

echo -e "${GREEN}✓ Labels created${NC}"
echo ""

# ============================================
# M1: PROJECT SETUP
# ============================================
echo -e "${YELLOW}Creating M1: Project Setup Issues...${NC}"

gh issue create \
  --title "#1: Initialize Next.js 14 project with TypeScript and Tailwind" \
  --label "priority:critical,type:chore,area:frontend" \
  --milestone "M1: Project Setup" \
  --body "## Description
Set up the base Next.js 14 project with all required dependencies.

## Tasks
- [ ] Create Next.js 14 app with App Router
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Install Lucide React icons
- [ ] Set up Framer Motion
- [ ] Configure path aliases (@/)
- [ ] Create basic folder structure

## Folder Structure
\`\`\`
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
├── hooks/
└── stores/
\`\`\`

## Acceptance Criteria
- [ ] Project runs with \`npm run dev\`
- [ ] TypeScript compiles without errors
- [ ] Tailwind classes work
- [ ] shadcn/ui components can be imported"

gh issue create \
  --title "#2: Set up Supabase project and database schema" \
  --label "priority:critical,type:chore,area:backend" \
  --milestone "M1: Project Setup" \
  --body "## Description
Create Supabase project and implement the full database schema.

## Tasks
- [ ] Create Supabase project
- [ ] Set up environment variables
- [ ] Create all tables (users, posts, connections, agent_actions, etc.)
- [ ] Set up Row Level Security policies
- [ ] Create database indexes

## Reference
See SPEC.md Section 8 for full schema

## Acceptance Criteria
- [ ] All tables created in Supabase
- [ ] RLS policies in place
- [ ] Can connect from Next.js app
- [ ] Migrations documented"

gh issue create \
  --title "#3: Configure authentication with Clerk" \
  --label "priority:critical,type:chore,area:backend" \
  --milestone "M1: Project Setup" \
  --body "## Description
Configure Clerk for authentication.

## Tasks
- [ ] Create Clerk application
- [ ] Install @clerk/nextjs
- [ ] Configure environment variables
- [ ] Set up ClerkProvider in layout
- [ ] Create sign-in/sign-up pages
- [ ] Set up middleware for protected routes
- [ ] Style Clerk components to match design

## Acceptance Criteria
- [ ] Users can sign up/sign in
- [ ] Protected routes redirect to auth
- [ ] Clerk UI matches app design"

gh issue create \
  --title "#4: Configure all environment variables" \
  --label "priority:critical,type:chore,area:backend" \
  --milestone "M1: Project Setup" \
  --body "## Description
Set up all required environment variables.

## Tasks
- [ ] Create .env.local file
- [ ] Create .env.example file
- [ ] Add all credentials (Supabase, Clerk, Anthropic, Twilio, Google)
- [ ] Document all variables in README

## .env.example
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ANTHROPIC_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
\`\`\`

## Acceptance Criteria
- [ ] All variables documented
- [ ] App runs with .env.local configured"

gh issue create \
  --title "#5: Set up design system with base UI components" \
  --label "priority:critical,type:feature,area:frontend" \
  --milestone "M1: Project Setup" \
  --body "## Description
Create the foundational design system and reusable components.

## Tasks
- [ ] Define color palette in tailwind.config
- [ ] Create CSS variables for theming
- [ ] Set up dark mode with next-themes
- [ ] Create ThemeToggle component
- [ ] Install/configure shadcn components (Button, Input, Card, Avatar, Badge, Dialog, Dropdown, Tabs, Toast, Skeleton)
- [ ] Create custom components (Logo, VerifiedBadge, TrustScoreBar, StatCard)

## Acceptance Criteria
- [ ] Light/dark mode toggle works
- [ ] All base components available
- [ ] Components match design spec"

gh issue create \
  --title "#6: Create app layout components" \
  --label "priority:critical,type:feature,area:frontend" \
  --milestone "M1: Project Setup" \
  --body "## Description
Build the main layout components for the app.

## Tasks
- [ ] Create PublicLayout (for landing, profiles)
- [ ] Create DashboardLayout (for authenticated pages)
- [ ] Create Navbar component
- [ ] Create Sidebar component (dashboard)
- [ ] Create Footer component
- [ ] Create MobileNav component
- [ ] Set up responsive breakpoints

## Acceptance Criteria
- [ ] Layouts render correctly
- [ ] Navigation works
- [ ] Responsive on mobile/tablet/desktop
- [ ] Sidebar collapses on mobile"

echo -e "${GREEN}✓ M1 Issues created (6)${NC}"

# ============================================
# M2: IDENTITY LAYER
# ============================================
echo -e "${YELLOW}Creating M2: Identity Layer Issues...${NC}"

gh issue create \
  --title "#7: Build the landing page" \
  --label "priority:critical,type:feature,area:frontend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Create the main landing page matching the Actual.ly design.

## Tasks
- [ ] Create hero section (\"Actual Humans Only\" headline)
- [ ] \"No ifs, ads, or bots\" subheadline
- [ ] Username claim input
- [ ] \"Get Started\" button
- [ ] About section
- [ ] Footer
- [ ] Add animations
- [ ] Make responsive

## Acceptance Criteria
- [ ] Matches Actual.ly design
- [ ] Username input validates (10-50 chars)
- [ ] Responsive on all devices"

gh issue create \
  --title "#8: Build username claiming and validation" \
  --label "priority:critical,type:feature,area:backend,area:frontend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Allow users to claim unique usernames.

## Tasks
- [ ] Create API route: POST /api/auth/claim-username
- [ ] Validate username format (10-50 chars, alphanumeric + underscore)
- [ ] Check username availability
- [ ] Reserve username for user
- [ ] Create username input component with real-time validation

## Acceptance Criteria
- [ ] Users can claim available usernames
- [ ] Taken usernames show error
- [ ] Invalid formats show validation error"

gh issue create \
  --title "#9: Implement phone + email verification (Clerk)" \
  --label "priority:critical,type:feature,area:frontend,area:backend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Implement real phone + email verification with Clerk.

## Tasks
- [ ] Create verification page UI
- [ ] Require phone + email verification
- [ ] Update user.is_verified on verification
- [ ] Set initial trust score (+50 for phone verification)
- [ ] Redirect to dashboard on success

## Acceptance Criteria
- [ ] Phone + email verification works
- [ ] is_verified set to true
- [ ] Trust score updated to 50"

gh issue create \
  --title "#10: Build user profile page" \
  --label "priority:critical,type:feature,area:frontend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Build the public-facing user profile page at actual.ly/username.

## Tasks
- [ ] Create dynamic route: /[username]/page.tsx
- [ ] Display avatar, name, username, verified badge
- [ ] Show trust score with visual bar
- [ ] Display bio and external links
- [ ] Agent status card
- [ ] Action buttons (Message, Connect)
- [ ] Handle 404 for non-existent users
- [ ] Add OG meta tags

## Acceptance Criteria
- [ ] Profile loads at /username
- [ ] Shows all user information
- [ ] Verified badge shows if verified"

gh issue create \
  --title "#11: Build trust score calculation system" \
  --label "priority:high,type:feature,area:backend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Implement the trust score calculation logic.

## Tasks
- [ ] Create calculateTrustScore function
- [ ] Calculate points (Phone verification +50, Email +10, Age +2/month, Connections +1 each, Engagement +1 per 100)
- [ ] Create API route: GET /api/users/:username/trust-score
- [ ] Create database trigger to recalculate on changes
- [ ] Create TrustScoreBreakdown component

## Acceptance Criteria
- [ ] Trust score calculates correctly
- [ ] Updates when factors change
- [ ] Breakdown shows point sources"

gh issue create \
  --title "#12: Build user API endpoints" \
  --label "priority:critical,type:feature,area:backend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Create all user-related API endpoints.

## Tasks
- [ ] GET /api/users/:username
- [ ] PATCH /api/users/:username
- [ ] GET /api/users/:username/posts
- [ ] GET /api/users/:username/connections
- [ ] Add authentication middleware
- [ ] Input validation with Zod

## Acceptance Criteria
- [ ] All endpoints work correctly
- [ ] Proper authentication/authorization"

gh issue create \
  --title "#13: Create profile edit page" \
  --label "priority:high,type:feature,area:frontend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Allow users to edit their profile information.

## Tasks
- [ ] Create /dashboard/settings/profile page
- [ ] Build profile edit form (display name, bio, avatar, links)
- [ ] Save changes to database
- [ ] Show success/error toasts

## Acceptance Criteria
- [ ] Users can edit their profile
- [ ] Changes save successfully
- [ ] Validation prevents invalid input"

gh issue create \
  --title "#14: Add phone/email verification" \
  --label "priority:medium,type:feature,area:backend" \
  --milestone "M2: Identity Layer" \
  --body "## Description
Allow users to verify phone and email for trust score.

## Tasks
- [ ] Email verification flow (Resend)
- [ ] Phone verification flow (Twilio)
- [ ] Update verification flags
- [ ] Recalculate trust score after verification

## Acceptance Criteria
- [ ] Email verification works
- [ ] Trust score updates correctly"

echo -e "${GREEN}✓ M2 Issues created (8)${NC}"

# ============================================
# Continue with M3-M6...
# ============================================

echo ""
echo -e "${GREEN}✅ Issue creation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. View issues: gh issue list"
echo "2. Start working on Issue #1"
echo "3. Close issues as you complete them: gh issue close <number>"
echo ""
echo -e "${YELLOW}Note: This script created the first 14 issues (M1 & M2).${NC}"
