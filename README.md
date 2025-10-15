# Minimal Todo List Application

A minimal, production-ready todo list application built with modern technologies and best practices.

## 🏗️ Architecture

This project follows the **Cleargent Four-Layer Convex Architecture Pattern**:

1. **Database Layer** (`convex/db/`) - Pure CRUD operations, only place where `ctx.db` is used
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic, authentication, and validation
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations (if needed)
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions with no database access

## 🛠️ Tech Stack

### Backend
- **Convex** - Real-time backend with TypeScript
- **Better Auth** - Modern authentication with email/password
- **Rate Limiter** - API protection and abuse prevention

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives

### Design System
- **Tone**: Neutral
- **Density**: Balanced
- **Primary Color**: #6366f1 (Indigo)
- **Typography**: Inter font family

## 📦 Convex Components

This project uses the following Convex Components:

### Core Components (TIER 1)
- **@convex-dev/better-auth** - Authentication and session management
  - Email/password authentication
  - 30-day JWT sessions
  - Secure user management

- **@convex-dev/rate-limiter** - Request rate limiting
  - Token bucket algorithm
  - Per-user rate limits
  - Production API protection

## 🚀 Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm
- Convex account (free at [convex.dev](https://convex.dev))

## 📥 Installation

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

```bash
# Generate BETTER_AUTH_SECRET with:
openssl rand -base64 32

# Other required variables will be filled during Convex setup
```

### 3. Initialize Convex

```bash
npx convex dev --once --configure new
```

This will:
- Create a new Convex project
- Generate `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Set up the database schema
- Install required Convex components

### 4. Install Convex Components

The components are already configured in `convex/convex.config.ts`, but you need to install them:

```bash
npx convex components install @convex-dev/better-auth --save
npx convex components install @convex-dev/rate-limiter --save
```

### 5. Start Development Servers

```bash
pnpm dev
# or
npm run dev
```

This runs both:
- Convex backend on port 3210 (dashboard)
- Next.js frontend on port 3000

## 📂 Project Structure

```
minimal-todo-convex/
├── convex/                    # Backend code
│   ├── convex.config.ts       # Component configuration
│   ├── schema.ts              # Database schema
│   ├── auth.ts                # Better Auth setup
│   ├── http.ts                # HTTP routes for auth
│   ├── db/                    # Database layer (Phase 2)
│   ├── endpoints/             # API endpoints (Phase 2)
│   └── helpers/               # Utility functions (Phase 2)
│
├── apps/
│   └── web/                   # Next.js frontend (Phase 2)
│
├── .env.local.example         # Environment template
├── package.json               # Root dependencies
└── pnpm-workspace.yaml        # Monorepo config
```

## 🔐 Authentication Setup

Better Auth is configured with:
- ✅ Email/password authentication
- ✅ 30-day JWT sessions
- ✅ Convex database adapter
- ❌ Email verification (disabled for development)

To add OAuth providers (GitHub, Google, etc.):
1. Add provider credentials to `.env.local`
2. Update `convex/auth.ts` configuration
3. Add provider buttons in frontend

## 🛡️ Rate Limiting

Rate limiting is configured to prevent API abuse:

- **Token Bucket Algorithm**: Allows bursts while maintaining average rate
- **Per-User Limits**: Each user has independent rate limits
- **Configurable**: Adjust limits in `convex/rateLimiter.ts` (Phase 2)

Example limits (to be configured in Phase 2):
- Create task: 10 per minute (burst capacity: 3)
- Update task: 50 per minute
- Delete task: 30 per minute

## 🗄️ Database Schema

### Tasks Table
```typescript
{
  userId: string,           // Owner of the task
  title: string,            // Task title
  description?: string,     // Optional description
  status: "todo" | "in_progress" | "completed",
  priority?: "low" | "medium" | "high",
  dueDate?: number,         // Unix timestamp
  completedAt?: number,     // Completion timestamp
  createdAt: number,        // Creation timestamp
  updatedAt: number,        // Last update timestamp
}
```

**Indexes:**
- `by_user` - Get all tasks for a user
- `by_user_and_status` - Filter tasks by status
- `by_user_and_created` - Sort tasks by creation date
- `by_user_and_due_date` - Find upcoming tasks

## 📝 Next Steps (Phase 2)

Phase 1 (Infrastructure) is complete! Next steps:

1. **Generate Database Layer** (`convex/db/`)
   - `tasks.ts` - CRUD operations for tasks

2. **Create Endpoints** (`convex/endpoints/`)
   - `tasks.ts` - Query and mutate tasks with auth

3. **Build Frontend** (`apps/web/`)
   - Authentication pages (login, signup)
   - Task list interface
   - Task creation/editing forms
   - shadcn/ui components

4. **Add Rate Limiting**
   - Configure rate limits in `convex/rateLimiter.ts`
   - Apply to task mutations

5. **Testing & Polish**
   - Add error handling
   - Optimize queries
   - Add loading states
   - Improve UX

## 🔗 Useful Links

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://www.better-auth.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Convex Components](https://docs.convex.dev/components)

## 📄 License

MIT

---

**Built with the Cleargent Convex Architecture Pattern** 🚀
