# Future Engineers - Student Notes Hub 🎓

A modern, collaborative web platform built with Next.js 15 for university students to access, share, and manage academic resources. The pl   │   ├── lib/                     # U## 🔒 **Security Features**

### **File Upload Security**
- **PDF file type validation** (client-side and server-side)
- **File size limits**: 4MB maximum enforced with user-friendly messages
- **Dual upload strategy**: 
  - Small files (≤3MB locally): Via Next.js API route with server validation
  - Large files (>3MB) or on Vercel: Direct to Cloudinary to bypass serverless limits
- **Cloudinary unsigned preset**: Secure browser-to-cloud uploads
- **Environment-aware routing**: Automatic detection of deployment platform
- **Input validation**: Comprehensive validation for all form fields
- **Error handling**: Detailed logging and user feedbacklibraries
│   │   ├── apiUpload.ts         # API route upload utilities
│   │   ├── directCloudinaryUpload.ts  # Direct browser upload
│   │   ├── firebase-admin.ts    # Firebase Admin SDK
│   │   ├── firebase.ts          # Firebase client config
│   │   ├── firestore.ts         # Firestore utilities
│   │   ├── QueryProvider.tsx    # React Query setup
│   │   └── utils.ts             # General utilitiesfeatures robust PDF document management, role-based access control, dual upload strategy for large files, and a community-driven approach to enhance the learning experience.

## 🎯 Project Overview

**Future Engineers** is a comprehensive educational platform designed to centralize academic resources for engineering students. It provides a secure, scalable solution for document sharing with advanced features like module-based organization, smart upload routing, admin management, user authentication, and optimized PDF handling with support for both small and large file uploads.

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- **Google OAuth Integration**: Secure authentication via Firebase Auth
- **Role-Based Access Control**: Admin, Contributor, and Student roles
- **Protected Routes**: Admin dashboard and user management

### 📚 **Document Management**
- **PDF Upload & Storage**: Cloudinary integration with dual upload strategy (API route + direct upload)
- **Smart Upload Routing**: Automatic selection between server upload and direct-to-Cloudinary upload
- **File Size Limit**: 4MB maximum for optimal performance and stability
- **Module-based Organization**: Module 1-5 support for Notes documents
- **Advanced Search**: Filter by semester, branch, subject, document type, and module
- **Document Analytics**: View and download tracking
- **Approval Workflow**: Admin moderation for uploaded content
- **Custom Document Types**: Notes, Question Papers, Lab Manuals with conditional fields

### 👨‍� **Admin Dashboard**
- **User Management**: View, manage, and assign roles to users
- **Content Moderation**: Approve/reject submitted documents
- **Analytics**: Track platform usage and engagement
- **Bulk Operations**: Efficient content management tools

### 🎨 **Modern UI/UX**
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Mobile-First Components**: Profile banners, leaderboard cards, resource pages
- **Dark/Light Theme**: User preference support with seamless toggle
- **Accessible Interface**: WCAG 2.1 compliant
- **Real-time Notifications**: Toast notifications for user feedback
- **Custom Dropdowns**: Modern, accessible document type and module selectors
- **Visual Guidelines**: Clear file size limits and upload requirements

### 🏆 **Community Features**
- **Leaderboard System**: Rankings based on contribution points
- **User Profiles**: Personalized dashboards with upload history
- **Profile Editing**: Update display name, bio, and profile information
- **Contribution Tracking**: View and manage all uploaded documents
- **Recognition System**: Points awarded for approved contributions

## 🏗️ **Tech Stack**

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: React Query (TanStack Query)

### **Backend & Services**
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **File Storage**: Cloudinary CDN with unsigned upload preset
- **Upload Strategy**: Dual approach (Next.js API + Direct browser upload)
- **Serverless Functions**: Next.js API Routes
- **Admin SDK**: Firebase Admin
- **Environment Detection**: Smart routing based on deployment platform

### **Development & Deployment**
- **Runtime**: Node.js 18+
- **Package Manager**: npm
- **Bundler**: Turbopack (Next.js 15)
- **Deployment**: Vercel (recommended)

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18 or later
- npm or yarn
- Firebase project
- Cloudinary account

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/future_engineers.git
   cd future_engineers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK (for server-side operations)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

   # Admin Configuration
   ADMIN_EMAILS=admin1@example.com,admin2@example.com
   ```

4. **Firebase Setup**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project
   firebase init firestore
   firebase init storage
   
   # Deploy Firestore rules and indexes
   firebase deploy --only firestore
   firebase deploy --only storage
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 **Project Structure**

```
future_engineers/
├── public/
│   ├── images/
│   │   └── logo.png              # Application logo
│   └── *.svg                     # Icon assets
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── page.tsx         # Main admin dashboard
│   │   │   ├── migrate-users/   # User migration tools
│   │   │   └── update-users/    # User management tools
│   │   ├── api/                 # API routes
│   │   │   ├── admin/           # Admin API endpoints
│   │   │   └── upload/          # File upload handlers
│   │   ├── browse/              # Document browsing page
│   │   ├── contribute/          # Document upload page
│   │   ├── dashboard/           # User dashboard
│   │   ├── leaderboard/         # User rankings
│   │   ├── profile/             # User profiles
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Shadcn/UI components
│   │   ├── BrowsePDFViewer.tsx  # PDF viewing component
│   │   ├── Header.tsx           # Navigation header
│   │   ├── PDFViewer.tsx        # PDF preview component
│   │   └── ThemeProvider.tsx    # Theme management
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication logic
│   │   ├── content/             # Content management
│   │   ├── dashboard/           # Dashboard features
│   │   └── profile/             # Profile management
│   ├── hooks/                   # Custom React hooks
│   │   └── useAdminStatus.ts    # Admin role verification
│   ├── lib/                     # Utility libraries
│   │   ├── apiUpload.ts         # Upload utilities
│   │   ├── firebase-admin.ts    # Firebase Admin SDK
│   │   ├── firebase.ts          # Firebase client config
│   │   ├── firestore.ts         # Firestore utilities
│   │   ├── QueryProvider.tsx    # React Query setup
│   │   └── utils.ts             # General utilities
│   ├── stores/                  # State management
│   │   ├── authStore.ts         # Authentication state
│   │   └── contentStore.ts      # Content management state
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts             # Shared type definitions
│   └── utils/                   # Utility functions
├── firebase/                    # Firebase Functions (if needed)
│   ├── src/
│   │   └── index.ts
│   └── package.json
├── .env.local                   # Environment variables (create this)
├── .gitignore                   # Git ignore rules
├── components.json              # Shadcn/UI configuration
├── eslint.config.mjs           # ESLint configuration
├── firebase.json               # Firebase project configuration
├── firestore.indexes.json     # Firestore composite indexes
├── firestore.rules            # Firestore security rules
├── next.config.ts             # Next.js configuration
├── package.json               # Project dependencies
├── postcss.config.mjs         # PostCSS configuration
├── storage.rules              # Firebase Storage rules
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## � **Security Features**

### **File Upload Security**
- PDF file type validation
- File size limits (50MB max)
- Cloudinary secure upload with authentication
- Server-side validation in API routes

### **Database Security**
- Firestore Security Rules for data protection
- Role-based access control
- Authentication required for all operations
- Admin verification for sensitive operations

### **API Security**
- Protected API routes with authentication
- Input validation and sanitization
- Rate limiting considerations
- CORS configuration

## 🚀 **Deployment**

### **Vercel Deployment (Recommended)**
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=...
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
   ADMIN_EMAILS=...
   ```
3. **Configure Cloudinary Upload Preset**:
   - Go to Cloudinary Dashboard → Settings → Upload
   - Create preset (e.g., "future_engineers")
   - **CRITICAL**: Set to "Unsigned" mode
   - Max File Size: 50MB
   - Allowed Formats: pdf,jpg,jpeg,png,webp
4. **Deploy**: Automatic deployment on push to main branch
5. **Verify**: Test file uploads on deployed site

### **Manual Deployment**
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📊 **Features in Detail**

### **Admin Dashboard**
- **User Management**: View all users with role assignment capabilities
- **Document Moderation**: Approve/reject submitted documents with review workflow
- **User Migration Tools**: Bulk update and reorganize user data
- **Platform Analytics**: Track usage, engagement, and contribution metrics
- **Backend Verification**: Secure admin role checks with Firebase Admin SDK

### **Document Management System**
- **Smart Upload Routing**:
  - Files ≤3MB (local): Upload via Next.js API route
  - Files >3MB or on Vercel: Direct browser-to-Cloudinary upload
  - Automatic environment detection (localhost vs vercel.app)
- **Module Support**: Module 1-5 selection for Notes documents
- **Document Types**: Notes, Question Papers, Lab Manuals
- **Advanced Filtering**: Semester, Branch, Subject, Type, Module
- **Cloudinary Integration**: CDN-powered delivery for fast access
- **View/Download Tracking**: Analytics for popular resources
- **Admin Approval**: Quality control before public visibility

### **User Experience**
- **Responsive Design**: 
  - Mobile-optimized profile banners (h-40, -mt-16)
  - Full leaderboard name display on all devices
  - 35+ mobile responsiveness improvements on resources pages
- **Theme Support**: Seamless dark/light mode toggle
- **Real-time Feedback**: Toast notifications for all user actions
- **Accessible Components**: Keyboard navigation, ARIA labels, semantic HTML
- **Visual Guidelines**: Clear file size limits and upload requirements
- **Custom UI Components**: Modern dropdowns, gradient buttons, animated cards

### **Upload Guidelines**
- **File Requirements**:
  - PDF files only
  - Maximum 4MB file size
  - Clear error messages for validation failures
  - Visual size limit indicators in UI
- **Required Information**:
  - Semester (1-8)
  - Branch (CSE, ECE, ME, CE, EEE, etc.)
  - Subject name
  - Document type (Notes/Question Papers/Lab Manuals)
  - Module (1-5, required for Notes only)
  - Title and description
- **Optional Fields**:
  - Tags for better discoverability

## 🐛 **Known Issues & Solutions**

### **Large File Upload on Vercel**
- **Issue**: Vercel serverless functions have 4.5MB payload limit (FUNCTION_PAYLOAD_TOO_LARGE)
- **Solution**: Implemented dual upload strategy
  - Local development: API route for files ≤3MB
  - Vercel deployment: Direct browser-to-Cloudinary upload
  - Environment detection: `window.location.hostname.includes('vercel.app')`
- **Current**: 4MB hard limit enforced with clear user messaging

### **PDF Preview Downloads**
- **Issue**: PDF preview was triggering unwanted downloads
- **Solution**: Implemented download-only approach for PDFs to prevent browser issues
- **Current**: Preview shows document info, actual viewing requires explicit user action

### **Admin Role Verification**
- **Issue**: Hardcoded admin email checks
- **Solution**: Implemented backend verification with useAdminStatus hook
- **Current**: Secure role-based access with server-side validation

### **Firestore Undefined Field Errors**
- **Issue**: Module field causing errors for non-Notes documents
- **Solution**: Conditional field addition based on document type
- **Current**: Clean data structure with proper field validation

### **Mobile Responsiveness**
- **Issue**: Profile banners, leaderboard names, and resource pages not mobile-friendly
- **Solution**: Comprehensive mobile optimization (35+ adjustments)
- **Current**: Fully responsive across all device sizes

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: [project-docs-url]

## � **Platform Stats**

- **Document Types**: 3 (Notes, Question Papers, Lab Manuals)
- **Module Support**: 5 modules for Notes
- **Semester Coverage**: 1-8
- **Upload Limit**: 4MB per file
- **Authentication**: Google OAuth via Firebase
- **CDN**: Cloudinary for global content delivery
- **Deployment**: Vercel with serverless functions

## 🎯 **Roadmap**

- [ ] Email notifications for upload approvals
- [ ] Advanced analytics dashboard
- [ ] Document rating and review system
- [ ] Bookmarking and favorites
- [ ] Mobile app (React Native)
- [ ] Offline document access
- [ ] AI-powered document recommendations
- [ ] Multi-language support

## �🙏 **Acknowledgments**

- **Next.js Team** - Amazing React framework with App Router and Turbopack
- **Firebase Team** - Comprehensive backend-as-a-service platform
- **Cloudinary** - Reliable media management and global CDN delivery
- **Shadcn/UI** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vercel** - Seamless deployment platform with edge functions
- **React Query** - Powerful data synchronization for React
- **Zustand** - Minimal state management solution

## 📚 **Documentation**

For detailed documentation, see:
- [Deployment Guide](./DEPLOYMENT.md)
- [Admin Setup](./ADMIN-SETUP.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Project Status](./PROJECT_STATUS.md)
- [Vercel Deployment Fix](./VERCEL_DEPLOYMENT_FIX.md)
- [Issue Resolution](./ISSUE-RESOLUTION.md)

---

**Built with ❤️ for the engineering student community by students, for students**

*Empowering knowledge sharing, one upload at a time* 🚀
