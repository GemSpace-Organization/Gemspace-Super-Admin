# 🔄 Development Workflow Guide

## 🌲 Branch Strategy

### **Production Branch: `main`**

- **Purpose**: Production-ready code
- **Protection**: Direct pushes disabled
- **Deployment**: Automatic to production environment
- **Access**: Only via approved PRs from `staging`

### **Testing Branch: `staging`**

- **Purpose**: Pre-production testing and QA
- **Testing**: All features tested here before production
- **CI/CD**: Automatic deployment to staging environment
- **Source**: Merges from `development` after feature completion

### **Development Branch: `development`**

- **Purpose**: Integration of completed features
- **Testing**: Unit tests and integration tests
- **Source**: Merges from feature branches
- **Target**: Creates PRs to `staging` for testing

### **Feature Branches: `feature/*`**

- **Naming Convention**:
  - `feature/user-authentication`
  - `feature/admin-dashboard`
  - `feature/data-visualization`
- **Purpose**: Individual feature development
- **Lifecycle**: Created from `development`, merged back when complete

### **Hotfix Branches: `hotfix/*`**

- **Naming Convention**: `hotfix/critical-security-patch`
- **Purpose**: Emergency fixes for production
- **Source**: Created from `main`
- **Target**: Merged to both `main` and `development`

---

## 🚀 Workflow Process

### **1. Feature Development**

```bash
# Start new feature
git checkout development
git pull origin development
git checkout -b feature/amazing-new-feature

# Develop your feature
git add .
git commit -m "feat: implement amazing new feature"
git push -u origin feature/amazing-new-feature

# Create PR to development
```

### **2. Testing Phase**

```bash
# After feature is merged to development
git checkout staging
git pull origin staging
git merge development
git push origin staging

# Deploy to staging environment for testing
# Run comprehensive tests, manual QA, performance testing
```

### **3. Production Deployment**

```bash
# After successful testing in staging
git checkout main
git pull origin main
git merge staging
git push origin main

# Automatic deployment to production
```

### **4. Hotfix Process**

```bash
# Emergency fix needed in production
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-fix

# Implement fix
git add .
git commit -m "hotfix: resolve critical security vulnerability"
git push -u origin hotfix/critical-issue-fix

# Create PRs to both main and development
```

---

## 🔒 Branch Protection Rules

### **Main Branch**

- ✅ Require pull request reviews (2 reviewers)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Restrict pushes to administrators only
- ✅ Require linear history

### **Staging Branch**

- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass
- ✅ Allow force pushes for testing

### **Development Branch**

- ✅ Require status checks to pass
- ✅ Allow merge commits for feature integration

---

## 📋 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user authentication system
fix: resolve login validation bug
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for user service
chore: update dependencies
perf: improve page load performance
```

---

## 🧪 Testing Strategy

### **Unit Tests**

- Run on every commit
- Coverage target: 80%+
- Tools: Jest, React Testing Library

### **Integration Tests**

- Run on PR to development
- Test API endpoints and components
- Tools: Cypress, Playwright

### **E2E Tests**

- Run on staging deployment
- Full user journey testing
- Tools: Playwright, Cypress

### **Performance Tests**

- Run weekly on staging
- Lighthouse CI integration
- Tools: WebPageTest, GTmetrix

---

## 🔄 CI/CD Pipeline

### **On Development Push**

1. ✅ Run unit tests
2. ✅ Run linting (ESLint)
3. ✅ Run type checking (TypeScript)
4. ✅ Build application
5. 🚀 Deploy to development environment

### **On Staging Push**

1. ✅ All development checks
2. ✅ Run integration tests
3. ✅ Run security scan
4. ✅ Performance audit
5. 🚀 Deploy to staging environment

### **On Main Push**

1. ✅ All previous checks
2. ✅ Run E2E tests
3. ✅ Generate changelog
4. ✅ Create release tag
5. 🚀 Deploy to production

---

## 📊 Code Quality Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Extended from Next.js rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Semantic versioning
- **Code Coverage**: Minimum 80%

---

## 🎯 Quick Commands

```bash
# Setup development environment
npm run dev

# Run all tests
npm run test
npm run test:watch
npm run test:coverage

# Code quality
npm run lint
npm run lint:fix
npm run typecheck
npm run format

# Build and deploy
npm run build
npm run start
npm run analyze
```

---

## 📁 Project Structure

```
gemspace-super-admin/
├── app/
│   ├── globals.css               # Global CSS design system (OKLCH tokens)
│   ├── layout.tsx                 # Root layout (fonts, theme provider)
│   ├── page.tsx                   # Root redirect
│   ├── (auth)/
│   │   ├── login/page.tsx         # Login page
│   │   └── forgot-password/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx             # Dashboard layout (sidebar + header)
│       ├── dashboard/page.tsx     # Overview dashboard
│       ├── tenants/page.tsx       # Tenant management
│       ├── tenant-admins/page.tsx # Tenant admin management
│       ├── platform-analytics/page.tsx
│       ├── subscriptions/page.tsx
│       ├── ai-services/page.tsx
│       ├── content-moderation/page.tsx
│       ├── audit-logs/page.tsx
│       ├── system-health/page.tsx
│       ├── announcements/page.tsx
│       ├── support-center/page.tsx
│       └── platform-settings/page.tsx
├── components/
│   ├── app-sidebar.tsx            # Main sidebar with nav data
│   ├── nav-main.tsx               # Collapsible navigation menu
│   ├── nav-user.tsx               # User dropdown (admin links)
│   ├── sidebar-brand.tsx          # GEM-SPACE brand mark
│   ├── theme-provider.tsx         # next-themes wrapper
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── forgot-password-form.tsx
│   ├── dashboard/                 # Per-page component folders
│   │   ├── overview/
│   │   ├── tenants/
│   │   ├── tenant-admins/
│   │   ├── analytics/
│   │   ├── subscriptions/
│   │   ├── ai/
│   │   ├── moderation/
│   │   ├── audit/
│   │   ├── system/
│   │   ├── announcements/
│   │   ├── support/
│   │   └── settings/
│   ├── layout/
│   │   └── site-header.tsx        # Sticky header with breadcrumbs
│   ├── shared/
│   │   ├── coming-soon.tsx        # Coming soon placeholder
│   │   └── theme-toggle.tsx       # Light/Dark/System switcher
│   └── ui/                        # shadcn/ui primitives
├── hooks/
├── lib/
│   └── utils.ts                   # cn() helper
└── public/
```

### Multi-Tenant Architecture

This is a **multi-tenant super admin** dashboard. The super admin manages:

- **Tenants** — Universities/institutions registered on the platform
- **Tenant Admins** — Administrators within each tenant
- **Platform Services** — AI features, subscriptions, and moderation

The super admin does NOT manage end-users (students, lecturers) directly. Each tenant manages their own users through their own admin dashboard.

### Navigation Routes

| Route                 | Description                   |
| --------------------- | ----------------------------- |
| `/dashboard`          | Platform overview             |
| `/tenants`            | Tenant management             |
| `/tenant-admins`      | Tenant admin management       |
| `/platform-analytics` | Usage and growth analytics    |
| `/subscriptions`      | Plans, invoices, revenue      |
| `/ai-services`        | AI model config and quotas    |
| `/content-moderation` | Review queue and policies     |
| `/audit-logs`         | Activity audit trail          |
| `/system-health`      | Uptime and performance        |
| `/announcements`      | Platform-wide announcements   |
| `/support-center`     | Support ticket management     |
| `/platform-settings`  | Global platform configuration |

### Theming

- **Default theme**: Light mode
- **Toggle**: Header dropdown (Light / Dark / System)
- **Keyboard shortcut**: Press `D` to toggle between light and dark
- **CSS system**: OKLCH color tokens in `globals.css`
- **Brand colors**: Ocean Teal `#1AB6B6`, Deep Indigo `#3B3A96`, Amber Gold `#F6B93B`

---

**📝 Remember**: Always test locally before pushing, write meaningful commit messages, and keep PRs focused on single features or fixes.
