# Contributing to Future Engineers 🚀

Thank you for your interest in contributing to **Future Engineers**! We're excited to have you join our community of developers working to create the best academic resource platform for engineering students. This guide will walk you through everything you need to know to contribute effectively.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community](#community)

---

## 📜 Code of Conduct

By participating in this project, you agree to:

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them learn
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy towards other community members

**Zero tolerance for:**
- ❌ Harassment, discrimination, or offensive behavior
- ❌ Trolling or insulting/derogatory comments
- ❌ Publishing others' private information
- ❌ Unethical or unprofessional conduct

Violations may result in temporary or permanent ban from the project.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or later ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed ([Download](https://git-scm.com/))
- **Firebase account** ([Create free account](https://firebase.google.com/))
- **Cloudinary account** ([Create free account](https://cloudinary.com/))
- **Code editor** (VS Code recommended)
- Basic knowledge of:
  - React & Next.js
  - TypeScript
  - Firebase & Firestore
  - Tailwind CSS

### Understanding the Project

**Future Engineers** is a Next.js 15 application that:
- Helps students access and share academic resources (Notes, Question Papers, Lab Manuals)
- Uses Firebase for authentication and database
- Uses Cloudinary for file storage and delivery
- Implements dual upload strategy for optimal file handling
- Features role-based access control (Admin, Contributor, Student)
- Supports module-based organization (Module 1-5 for Notes)
- Has a 4MB file size limit for uploads

**Key Technologies:**
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Storage**: Cloudinary CDN
- **UI Components**: Shadcn/UI
- **State Management**: Zustand
- **Deployment**: Vercel

---

## 💻 Development Setup

### Step 1: Fork and Clone

1. **Fork the repository** on GitHub (click "Fork" button)

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/future_engineers.git
   cd future_engineers
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ItsVikasA/Future-Engineers.git
   ```

4. **Verify remotes**:
   ```bash
   git remote -v
   # origin    https://github.com/YOUR_USERNAME/future_engineers.git (fetch)
   # origin    https://github.com/YOUR_USERNAME/future_engineers.git (push)
   # upstream  https://github.com/ItsVikasA/Future-Engineers.git (fetch)
   # upstream  https://github.com/ItsVikasA/Future-Engineers.git (push)
   ```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (Get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Download service account key from Firebase)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Cloudinary Configuration (Get from Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Admin Configuration (Add your email to test admin features)
ADMIN_EMAILS=your_email@example.com
```

**Important Notes:**
- Never commit `.env.local` to Git (already in `.gitignore`)
- For Cloudinary, create an "unsigned" upload preset named (e.g., "future_engineers")
- Firebase private key should be wrapped in double quotes

### Step 4: Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Google Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Google provider

3. **Create Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a region

4. **Deploy Firestore Rules** (from project root):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore  # Select existing project
   firebase deploy --only firestore
   ```

5. **Get Admin SDK credentials**:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save JSON file securely (don't commit!)
   - Copy values to `.env.local`

### Step 5: Cloudinary Setup

1. **Create account** at [Cloudinary](https://cloudinary.com/)

2. **Create Upload Preset**:
   - Go to Settings → Upload
   - Click "Add upload preset"
   - Name: `future_engineers` (or your choice)
   - **Signing Mode**: Select **"Unsigned"** (IMPORTANT!)
   - Max File Size: 50MB
   - Allowed Formats: `pdf,jpg,jpeg,png,webp`
   - Save

3. **Copy credentials** to `.env.local`

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 7: Verify Setup

Test these features:
- ✅ Home page loads
- ✅ Google sign-in works
- ✅ Browse page displays (even if empty)
- ✅ Contribute page loads
- ✅ Theme toggle works
- ✅ No console errors

---

## 🛠️ How to Contribute

### Types of Contributions Welcome

We welcome all types of contributions:

1. **🐛 Bug Fixes**: Fix reported issues or bugs you discover
2. **✨ New Features**: Implement features from the roadmap or propose new ones
3. **📱 UI/UX Improvements**: Enhance design, responsiveness, accessibility
4. **📝 Documentation**: Improve README, guides, code comments
5. **🧪 Testing**: Add tests, improve coverage
6. **♻️ Refactoring**: Improve code quality, performance
7. **🔐 Security**: Identify and fix security vulnerabilities
8. **🌐 Translations**: Add multi-language support (future)
9. **🎨 Design**: Create mockups, icons, graphics

### Contribution Workflow

#### 1. Find or Create an Issue

**Browse existing issues:**
- Visit [Issues](https://github.com/ItsVikasA/Future-Engineers/issues)
- Look for labels: `good first issue`, `help wanted`, `bug`, `enhancement`

**Create new issue if needed:**
- Check if issue already exists
- Use issue templates
- Provide detailed description
- Add relevant labels

**Claim an issue:**
- Comment: "I'd like to work on this"
- Wait for maintainer approval
- Ask questions if anything is unclear

#### 2. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update your fork
git checkout master
git fetch upstream
git merge upstream/master
git push origin master

# Create feature branch
git checkout -b feature/your-feature-name
# OR for bug fixes
git checkout -b fix/issue-description
```

**Branch naming conventions:**
- `feature/add-pdf-annotations` - New features
- `fix/upload-error-handling` - Bug fixes
- `docs/update-contributing` - Documentation
- `refactor/optimize-queries` - Code refactoring
- `style/mobile-responsive-fix` - UI/styling changes
- `test/add-auth-tests` - Testing
- `chore/update-dependencies` - Maintenance

#### 3. Make Your Changes

**Before coding:**
- Read relevant documentation
- Understand existing code patterns
- Check related files and components
- Plan your approach

**While coding:**
- Write clean, readable code
- Follow project coding standards (see below)
- Add comments for complex logic
- Keep changes focused and atomic
- Test frequently during development

**Types of files you might work with:**
- `src/app/*/page.tsx` - Page components
- `src/components/*` - Reusable components
- `src/lib/*` - Utility functions
- `src/stores/*` - State management
- `src/types/*` - TypeScript definitions
- `src/app/api/*` - API routes
- `firestore.rules` - Database security rules

#### 4. Test Your Changes

**Manual testing checklist:**
- ✅ Feature works as expected
- ✅ No console errors or warnings
- ✅ Responsive on mobile, tablet, desktop
- ✅ Works in Chrome, Firefox, Safari
- ✅ Dark and light themes work
- ✅ Authentication flows unaffected
- ✅ File upload/download works
- ✅ No breaking changes to existing features

**Build test:**
```bash
npm run build
npm start
```

#### 5. Commit Your Changes

Follow our commit message convention (see [Commit Guidelines](#commit-guidelines)):

```bash
git add .
git commit -m "feat: add PDF annotation feature"
```

**Make multiple small commits** rather than one large commit:
```bash
git commit -m "feat: add annotation UI components"
git commit -m "feat: implement annotation save logic"
git commit -m "feat: add annotation display on PDF viewer"
git commit -m "docs: update README with annotation feature"
```

#### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

#### 7. Create Pull Request

1. **Go to your fork** on GitHub
2. **Click "Compare & pull request"**
3. **Fill out PR template** (if available) with:
   - **Title**: Clear, concise description (follows commit convention)
   - **Description**: 
     - What changes were made
     - Why these changes are needed
     - Related issue numbers (e.g., "Closes #123")
     - Screenshots/videos for UI changes
     - Testing performed
   - **Checklist**: Mark completed items

4. **Submit the pull request**

**Example PR description:**
```markdown
## Description
Adds PDF annotation feature allowing users to highlight and add notes to PDFs.

## Related Issue
Closes #45

## Changes Made
- Added annotation toolbar component
- Implemented highlight and text note functionality
- Added annotation save/load to Firestore
- Updated PDF viewer to display annotations
- Added annotation management in user profile

## Screenshots
[Include before/after screenshots]

## Testing
- [x] Tested on Chrome, Firefox, Safari
- [x] Tested on mobile and desktop
- [x] Verified annotations persist after reload
- [x] Checked dark/light theme compatibility
- [x] Build succeeds without errors

## Additional Notes
Annotations are stored per user in Firestore under `userAnnotations` collection.
```

#### 8. Address Review Feedback

**When maintainers review your PR:**
- Be responsive to feedback
- Make requested changes promptly
- Ask questions if feedback is unclear
- Push additional commits to the same branch
- Don't force push after review starts

**Making changes after review:**
```bash
# Make changes based on feedback
git add .
git commit -m "fix: address review feedback on error handling"
git push origin feature/your-feature-name
```

#### 9. Merge and Cleanup

**After your PR is merged:**
```bash
# Switch to master
git checkout master

# Update from upstream
git fetch upstream
git merge upstream/master

# Delete feature branch locally
git branch -d feature/your-feature-name

# Delete feature branch remotely
git push origin --delete feature/your-feature-name

# Push updated master to your fork
git push origin master
```

---

## 📐 Coding Standards

### General Principles

1. **DRY (Don't Repeat Yourself)**: Extract repeated code into reusable functions/components
2. **KISS (Keep It Simple, Stupid)**: Favor simple solutions over complex ones
3. **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until it's needed
4. **Separation of Concerns**: Keep business logic, UI, and data access separate
5. **Consistent Naming**: Use clear, descriptive names

### TypeScript Guidelines

**✅ DO:**
```typescript
// Use proper typing
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'contributor' | 'student';
  contributions: number;
}

// Use type inference when obvious
const count = 0; // inferred as number

// Export types for reuse
export type DocumentType = 'Notes' | 'Question Papers' | 'Lab Manuals';
```

**❌ DON'T:**
```typescript
// Avoid 'any' type
function processData(data: any) { // Bad
  return data;
}

// Use unknown or proper type instead
function processData(data: unknown) { // Good
  // Type guard needed
}

// Don't skip type definitions
const user = {}; // Bad - implicit any
const user: UserProfile = { ... }; // Good
```

### React Component Guidelines

**✅ Functional Components with Hooks:**
```typescript
// Good component structure
'use client'; // If client component

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ProfileCardProps {
  userId: string;
  onUpdate?: () => void;
}

export function ProfileCard({ userId, onUpdate }: ProfileCardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return null;

  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
}
```

**Component organization:**
1. Imports (external, then internal)
2. Type definitions
3. Component declaration
4. State and hooks
5. Effects
6. Event handlers
7. Helper functions
8. Early returns (loading, error states)
9. Main JSX return

### Styling with Tailwind CSS

**✅ Best Practices:**
```typescript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-semibold text-foreground">Title</h2>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>

// Dark mode support (use theme variables)
<div className="bg-background text-foreground border-border">
  {/* Content */}
</div>
```

**❌ Avoid:**
```typescript
// Don't use inline styles (unless absolutely necessary)
<div style={{ padding: '16px', backgroundColor: '#fff' }}> // Bad

// Don't hardcode colors (use theme variables)
<div className="bg-white text-black"> // Bad
<div className="bg-background text-foreground"> // Good
```

### File Organization

**Component files:**
```
ComponentName.tsx          # Single component
  OR
ComponentName/
  ├── index.tsx           # Main component
  ├── ComponentName.test.tsx  # Tests (future)
  └── types.ts            # Component-specific types
```

**Naming conventions:**
- Components: `PascalCase` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- Types/Interfaces: `PascalCase` (e.g., `UserProfile`, `DocumentData`)

### Code Comments

**When to comment:**
```typescript
// ✅ Complex business logic
// Calculate contribution points: 10 per approved document + 5 per download
const points = (approvedDocs * 10) + (totalDownloads * 5);

// ✅ Non-obvious workarounds
// Workaround for Vercel 4.5MB payload limit - use direct upload
const useDirectUpload = file.size > FILE_SIZE_LIMIT || isVercel;

// ✅ Important warnings
// IMPORTANT: Module field only applies to Notes documents
if (documentType === 'Notes' && module) {
  docData.module = module;
}
```

**Don't comment:**
```typescript
// ❌ Obvious code
// Set loading to true
setLoading(true); // Bad - self-explanatory

// ❌ Instead of comments, use better names
// Check if user is admin
if (u.r === 'a') { } // Bad

if (user.role === 'admin') { } // Good - self-documenting
```

### Error Handling

```typescript
// ✅ Proper error handling
try {
  const result = await uploadFile(file);
  toast.success('Upload successful!');
  return result;
} catch (error) {
  console.error('Upload failed:', error);
  const message = error instanceof Error ? error.message : 'Upload failed';
  toast.error(message);
  throw error; // Re-throw if caller needs to handle
}

// ✅ User-friendly error messages
if (file.size > MAX_FILE_SIZE) {
  toast.error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum is 4MB.`);
  return;
}
```

### Performance Considerations

```typescript
// ✅ Memoize expensive computations
const sortedDocuments = useMemo(() => {
  return documents.sort((a, b) => b.timestamp - a.timestamp);
}, [documents]);

// ✅ Debounce search inputs
const debouncedSearch = useMemo(
  () => debounce((query: string) => performSearch(query), 300),
  []
);

// ✅ Lazy load heavy components
const PDFViewer = dynamic(() => import('./PDFViewer'), {
  loading: () => <p>Loading viewer...</p>,
});
```

---

## 📝 Commit Guidelines

We follow the **Conventional Commits** specification for clear git history and automated changelog generation.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples:**
```bash
feat(upload): add PDF annotation support

Implements highlight and text annotation features for PDF documents.
Annotations are saved per user in Firestore.

Closes #45

fix(auth): resolve Google sign-in redirect loop

The redirect was caused by incorrect callback URL handling.
Updated Firebase auth configuration to fix the issue.

Fixes #89

docs(readme): update installation instructions

Added detailed Cloudinary setup steps and troubleshooting section.

chore(deps): update Next.js to 15.1.0

refactor(profile): extract user stats to separate component

style(mobile): improve responsive layout for leaderboard

test(upload): add unit tests for file validation

perf(query): optimize Firestore document queries
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(browse): add filter by module` |
| `fix` | Bug fix | `fix(upload): handle large file errors` |
| `docs` | Documentation only | `docs(api): add endpoint documentation` |
| `style` | Code style/formatting (not CSS) | `style: fix indentation in utils.ts` |
| `refactor` | Code refactoring | `refactor(auth): simplify login logic` |
| `perf` | Performance improvement | `perf(query): add index for faster searches` |
| `test` | Adding/updating tests | `test(upload): add validation tests` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |
| `build` | Build system changes | `build: update webpack config` |
| `revert` | Revert previous commit | `revert: revert feat(upload) commit` |

### Commit Scope (Optional)

Specifies what part of codebase is affected:
- `upload` - Upload functionality
- `auth` - Authentication
- `profile` - User profiles
- `admin` - Admin dashboard
- `browse` - Browse/search
- `ui` - UI components
- `api` - API routes
- `db` - Database/Firestore
- `config` - Configuration

### Commit Subject Rules

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Maximum 72 characters
- Be specific and descriptive

**✅ Good:**
```
feat(upload): add module selection for notes
fix(auth): resolve token expiration handling
docs(setup): improve Firebase configuration steps
```

**❌ Bad:**
```
Added some stuff                    // Too vague
Fixed bug.                          // Not descriptive
feat(Upload): Add Module Selection  // Wrong capitalization
Implemented the feature for adding module selection dropdown in the upload form which allows users to select modules // Too long
```

### Commit Body (Optional)

- Explain **what** and **why**, not **how**
- Wrap at 72 characters
- Separate from subject with blank line

### Commit Footer (Optional)

- Reference related issues: `Closes #123`, `Fixes #456`, `Refs #789`
- Note breaking changes: `BREAKING CHANGE: API endpoint changed`

---

## 🔀 Pull Request Process

### Before Creating PR

**Pre-submission checklist:**
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (README, code comments)
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile and desktop
- [ ] Dark and light themes work
- [ ] Build succeeds: `npm run build`
- [ ] Committed with conventional commit messages
- [ ] Branch is up-to-date with master:
  ```bash
  git fetch upstream
  git rebase upstream/master
  ```

### PR Title

Follow same format as commit messages:
```
feat(upload): add PDF annotation feature
fix(mobile): resolve navbar overflow on small screens
docs(contributing): add detailed setup instructions
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Closes #123 (or) Fixes #456 (or) Refs #789

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] UI/UX improvement

## Changes Made
- Detailed list of changes
- Another change
- And another

## Screenshots (if applicable)
[Add before/after screenshots for UI changes]

## Testing Performed
- [ ] Tested on Chrome
- [ ] Tested on Firefox  
- [ ] Tested on Safari
- [ ] Tested on mobile devices
- [ ] Tested dark and light themes
- [ ] Build succeeds without errors
- [ ] No console errors or warnings

## Additional Notes
Any additional information, context, or concerns.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review
- [ ] I have commented complex code sections
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly
- [ ] Any dependent changes have been merged
```

### PR Review Process

1. **Automated Checks**: CI/CD runs (if configured)
2. **Maintainer Review**: Code review by maintainers
3. **Feedback Cycle**: Address requested changes
4. **Approval**: PR approved by maintainer(s)
5. **Merge**: PR merged into master branch

**Review timeline:**
- Initial review: Within 2-7 days
- Follow-up reviews: 1-3 days after updates

### During Review

**Be responsive:**
- Check GitHub notifications regularly
- Respond to feedback within 3-5 days
- Ask questions if feedback is unclear
- Be open to suggestions and alternative approaches

**Handling feedback:**
```bash
# Make changes based on review
git add .
git commit -m "fix: address review comments on error handling"
git push origin feature/your-feature-name

# PR automatically updates
```

**If maintainer requests changes:**
- Understand the reasoning
- Discuss if you disagree (politely!)
- Make requested changes
- Reply to comments when addressed

### After Merge

**Congratulations! 🎉**

Your contribution is now part of Future Engineers!

**Post-merge actions:**
1. **Update your fork** (see step 9 in workflow)
2. **Close related issues** (if not auto-closed)
3. **Share your contribution** (optional):
   - Tweet about it
   - Add to your portfolio
   - Update LinkedIn

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

**Before submitting PR, test:**

**✅ Functionality:**
- Feature works as intended
- Edge cases handled
- Error states display correctly
- Success states display correctly

**✅ Browser Compatibility:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**✅ Responsive Design:**
- Mobile (320px - 768px)
- Tablet (769px - 1024px)
- Desktop (1025px+)
- Test portrait and landscape

**✅ Theme Support:**
- Light theme
- Dark theme
- Theme toggle works

**✅ Authentication:**
- Login flow works
- Logout works
- Protected routes redirect correctly
- User state persists

**✅ File Operations (if applicable):**
- Upload works (< 4MB files)
- Large files (> 4MB) show error
- Non-PDF files rejected
- Download works
- Preview/view works

**✅ Performance:**
- Pages load quickly
- No memory leaks
- Images optimized
- No unnecessary re-renders

**✅ Accessibility:**
- Keyboard navigation works
- Screen reader compatible (use  semantic HTML)
- Proper ARIA labels
- Sufficient color contrast

**✅ Build:**
```bash
npm run build
# Should complete without errors
```

### Test Scenarios

**Example: Testing Upload Feature**
1. Select valid PDF (< 4MB) → Should upload successfully
2. Select large PDF (> 4MB) → Should show error
3. Select non-PDF file → Should show error
4. Select PDF without required fields → Should show validation errors
5. Upload while logged out → Should redirect to login
6. Upload as student → Should work
7. Upload as admin → Should work
8. Cancel upload mid-process → Should cancel cleanly
9. Upload same file twice → Should both work
10. Upload with special characters in name → Should work

---

## 📚 Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing behavior
- Fix bugs with user-facing impact
- Add new configuration options
- Change setup procedures
- Add new environment variables
- Change API endpoints

### What to Document

**README.md:**
- New features in "Key Features" section
- New setup steps
- New environment variables
- New dependencies
- Breaking changes

**Code Comments:**
```typescript
/**
 * Uploads file directly to Cloudinary bypassing Next.js API.
 * Used for files >3MB or when running on Vercel to avoid payload limits.
 * 
 * @param file - File to upload
 * @param cloudName - Cloudinary cloud name
 * @param uploadPreset - Unsigned upload preset name
 * @param onProgress - Progress callback (0-100)
 * @returns Promise with Cloudinary response
 */
export async function uploadDirectlyToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryResponse> {
  // Implementation
}
```

**CONTRIBUTING.md** (this file):
- New setup requirements
- New coding standards
- New tools or processes

**Issue/PR templates:**
- Update if new information needed

---

## 🐛 Issue Reporting

### Before Reporting

1. **Search existing issues**: Your issue may already be reported
2. **Check documentation**: Issue might be user error
3. **Try latest version**: Bug might be fixed
4. **Reproduce consistently**: Ensure it's not a one-time glitch

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g., Windows 11, macOS Sonoma, Ubuntu 22.04]
- Browser: [e.g., Chrome 119, Firefox 120, Safari 17]
- Screen Size: [e.g., 1920x1080, Mobile 375x667]
- Device: [e.g., Desktop, iPhone 14, Samsung Galaxy S23]

## Console Errors
```
Paste any error messages from browser console
```

## Additional Context
Any other relevant information.

## Possible Solution (optional)
If you have ideas on how to fix it.
```

### Bug Severity Labels

- `critical` - App crashes, data loss, security issue
- `high` - Major feature broken, affects many users
- `medium` - Feature partially broken, workaround exists
- `low` - Minor issue, cosmetic, edge case

---

## 💡 Feature Requests

### Before Requesting

1. **Search existing requests**: Someone may have requested it
2. **Check roadmap**: Feature might be planned
3. **Consider scope**: Is it aligned with project goals?

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature.

## Problem it Solves
What problem does this feature address?

## Proposed Solution
How would you like this feature to work?

## Alternative Solutions
Other approaches you've considered.

## Use Cases
Who would benefit? How would they use it?

## Examples
Examples from other platforms or mockups (if any).

## Additional Context
Screenshots, mockups, or additional details.

## Willingness to Contribute
- [ ] I can help implement this feature
- [ ] I can help with design/mockups
- [ ] I can help with documentation
- [ ] I can provide user feedback/testing
```

---

## 👥 Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests, questions
- **GitHub Discussions**: General discussions, Q&A, showcases
- **Pull Requests**: Code review, technical discussions

### Getting Help

**Stuck? Need help?**

1. **Check documentation**: README, CONTRIBUTING, other docs
2. **Search issues**: Someone might have had same problem
3. **Ask in discussions**: Create a discussion thread
4. **Contact maintainers**: Comment on related issue or create new one

**When asking for help:**
- Be specific about the problem
- Include error messages
- Describe what you've tried
- Provide relevant code/config
- Be patient and respectful

### Recognition

Contributors are recognized in:

**README.md:**
```markdown
## 👥 Contributors

Thanks to these wonderful people:

- [@username](https://github.com/username) - Feature X, Bug fix Y
- [@another](https://github.com/another) - Documentation improvements
```

**Release Notes:**
```markdown
## v2.0.0

### New Features
- Feature X (@username)
- Feature Y (@another)

### Bug Fixes
- Fix Z (@contributor)
```

**Hall of Fame:**
Top contributors may be featured in project documentation.

---

## 📜 License

By contributing to Future Engineers, you agree that your contributions will be licensed under the same license as the project (MIT License).

This means:
- ✅ Your code can be used freely
- ✅ Your code can be modified
- ✅ Your code can be distributed
- ✅ You will be attributed as contributor

---

## 🎯 Quick Start for First-Time Contributors

**Never contributed to open source? No problem!**

1. **Pick a "good first issue"**:
   - Look for issues labeled `good first issue`
   - These are beginner-friendly tasks
   - Don't hesitate to ask questions!

2. **Simple contributions to start:**
   - Fix typos in documentation
   - Improve README clarity
   - Add code comments
   - Fix simple UI bugs
   - Improve error messages
   - Add examples to documentation

3. **Learn as you go:**
   - Don't be afraid to ask questions
   - Learn from code reviews
   - Read other people's PRs
   - Experiment in your fork

4. **Resources for beginners:**
   - [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
   - [First Contributions](https://github.com/firstcontributions/first-contributions)
   - [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
   - [React Documentation](https://react.dev/)
   - [Next.js Documentation](https://nextjs.org/docs)
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Contact

- **Project Owner**: [@ItsVikasA](https://github.com/ItsVikasA)
- **Repository**: [Future-Engineers](https://github.com/ItsVikasA/Future-Engineers)
- **Issues**: [GitHub Issues](https://github.com/ItsVikasA/Future-Engineers/issues)

---

## 🙏 Thank You!

Thank you for considering contributing to Future Engineers! Every contribution, no matter how small, helps make this platform better for thousands of engineering students.

Your efforts are appreciated, and we're excited to see what you'll build!

**Happy Coding! 🚀**

---

*Last Updated: October 2025*
*For questions about this guide, please open an issue.*
- Clear title and description
- Reference any related issues
- Screenshots if applicable
- Testing information

## 📋 Code Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop typing

### Styling
- Use Tailwind CSS for styling
- Follow the existing design patterns
- Ensure responsive design

### File Organization
- Place components in appropriate directories
- Use clear, descriptive file names
- Follow the existing folder structure

## 🧪 Testing

- Test your changes in different browsers
- Verify responsive design on various screen sizes
- Test authentication flows
- Ensure PDF upload/download functionality works

## 📝 Documentation

- Update README.md if needed
- Add comments to complex code
- Update type definitions
- Document new environment variables

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 💡 Feature Requests

When suggesting features:
- Explain the use case
- Describe the proposed solution
- Consider alternative approaches
- Think about implementation complexity

## 🔍 Review Process

All pull requests will be reviewed for:
- Code quality and style
- Functionality and testing
- Documentation completeness
- Security considerations
- Performance impact

## 📞 Getting Help

- Create an issue for questions
- Check existing issues and discussions
- Contact maintainers if needed

## 🙏 Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- Project documentation

Thank you for helping make Future Engineers better! 🚀
