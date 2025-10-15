# Quick Start Guide

Get your todo app running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in the required values:

```bash
# Convex (REQUIRED) - Get these after running convex dev
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Better Auth (REQUIRED)
# Generate a random secret:
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Initialize Convex

First time setup:

```bash
npx convex dev --once --configure new
```

This will:
- Create a new Convex project (or connect to existing)
- Generate your deployment URL
- Set up authentication
- Deploy your schema

**Important:** After this command completes, copy the `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` values into your `.env.local` file.

## Step 4: Start Development Server

Start both Convex backend and Next.js frontend:

```bash
npm run dev
```

This runs:
- `convex dev` - Convex backend (watches for changes)
- `next dev` - Next.js frontend at http://localhost:3000

## Step 5: Create Your First Task

1. Open http://localhost:3000 in your browser
2. You'll see the dashboard (empty initially)
3. Click "New Task" button
4. Fill in task details:
   - **Title:** Your first task (required)
   - **Description:** Optional details
   - **Priority:** Low, Medium, or High
   - **Due Date:** Optional deadline
5. Click "Create Task"
6. Watch it appear in real-time! ✨

## Features to Try

### Task Management
- ✅ Create tasks with the "New Task" button
- ✅ Click the circle icon to cycle through statuses (To Do → In Progress → Completed)
- ✅ Click the trash icon to delete a task
- ✅ Use tabs to filter tasks by status

### Dashboard
- ✅ View task statistics (Total, To Do, In Progress, Completed)
- ✅ See recent tasks in the "Recent Tasks" tab
- ✅ Watch metrics update in real-time as you create/update tasks

### Rate Limiting (Try It!)
- Try creating 6 tasks rapidly - you'll hit the rate limit
- The app will show a friendly error with retry time
- This prevents abuse in production

## Architecture Highlights

This app demonstrates production-ready patterns:

### Four-Layer Architecture
```
Database Layer (convex/db/)
  ↓ (pure async functions)
Endpoint Layer (convex/endpoints/)
  ↓ (queries & mutations)
Frontend (apps/web/)
```

### Key Features
- **Better Auth** - Secure authentication with JWT sessions
- **Rate Limiting** - Prevents API abuse
- **Real-time Updates** - Convex subscriptions
- **Type Safety** - End-to-end TypeScript
- **Design System** - Shared components and tokens

## Troubleshooting

### "CONVEX_DEPLOYMENT is not set"
- Run `npx convex dev --once --configure new`
- Copy the generated values to `.env.local`
- Restart the dev server

### "Not authenticated" errors
- The app requires authentication
- In development, Better Auth creates a test user automatically
- Check browser console for auth errors

### Types not generating
- Make sure `convex dev` is running
- Types are auto-generated in `convex/_generated/`
- Restart your TypeScript server in VS Code

### Components not found
- Run `npm install` in the root directory
- Workspace packages should be linked automatically

## Next Steps

### Add More Features
- Task categories/tags
- Task search and filtering
- Drag-and-drop reordering
- Email notifications (add Resend component)
- AI task suggestions (add Agent component)

### Deploy to Production

1. **Deploy Convex Backend:**
```bash
npx convex deploy
```

2. **Deploy Next.js Frontend:**
- Vercel: `vercel deploy`
- Netlify: `netlify deploy`
- Any platform supporting Next.js 15

3. **Update Environment Variables:**
- Set production Convex URL
- Generate new BETTER_AUTH_SECRET for production
- Set production SITE_URL

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://www.better-auth.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Four-Layer Architecture](./README.md#architecture)

## Getting Help

If you run into issues:
1. Check the browser console for errors
2. Check the Convex dashboard logs
3. Review `IMPLEMENTATION.md` for architecture details
4. Check environment variables in `.env.local`

Happy coding! 🚀
