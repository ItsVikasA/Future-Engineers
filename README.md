# Future Engineers - Student Notes Hub

A modern, collaborative web platform built with Next.js 15 for university students to access, share, and manage academic resources. The platform features robust PDF document management, role-based access control, and a community-driven approach to enhance the learning experience.

## 🎯 Project Overview

**Future Engineers** is a comprehensive educational platform designed to centralize academic resources for engineering students. It provides a secure, scalable solution for document sharing with advanced features like admin management, user authentication, and optimized PDF handling.

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- **Google OAuth Integration**: Secure authentication via Firebase Auth
- **Role-Based Access Control**: Admin, Contributor, and Student roles
- **Protected Routes**: Admin dashboard and user management

### 📚 **Document Management**
- **PDF Upload & Storage**: Cloudinary integration for reliable file handling
- **Advanced Search**: Filter by semester, subject, and document type
- **Document Analytics**: View and download tracking
- **Approval Workflow**: Admin moderation for uploaded content

### 👨‍� **Admin Dashboard**
- **User Management**: View, manage, and assign roles to users
- **Content Moderation**: Approve/reject submitted documents
- **Analytics**: Track platform usage and engagement
- **Bulk Operations**: Efficient content management tools

### 🎨 **Modern UI/UX**
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Theme**: User preference support
- **Accessible Interface**: WCAG 2.1 compliant
- **Real-time Notifications**: Toast notifications for user feedback

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
- **Authentication**: Firebase Auth
- **File Storage**: Cloudinary CDN
- **Serverless Functions**: Next.js API Routes
- **Admin SDK**: Firebase Admin

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
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

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
- User role management with backend verification
- Document approval/rejection workflow
- Platform analytics and user insights
- Bulk operations for content management

### **Document Management**
- Cloudinary-powered PDF storage and delivery
- Advanced search and filtering capabilities
- View and download tracking
- Responsive PDF preview (download-only for stability)

### **User Experience**
- Modern, responsive design with Tailwind CSS
- Dark/light theme support
- Real-time notifications with react-hot-toast
- Accessible navigation and interactions

## 🐛 **Known Issues & Solutions**

### **PDF Preview Downloads**
- **Issue**: PDF preview was triggering unwanted downloads
- **Solution**: Implemented download-only approach for PDFs to prevent browser issues
- **Current**: Preview shows document info, actual viewing requires explicit user action

### **Admin Role Verification**
- **Issue**: Hardcoded admin email checks
- **Solution**: Implemented backend verification with useAdminStatus hook
- **Current**: Secure role-based access with server-side validation

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: [project-docs-url]

## 🙏 **Acknowledgments**

- **Next.js Team** - Amazing React framework with App Router
- **Firebase Team** - Comprehensive backend-as-a-service
- **Cloudinary** - Reliable media management and delivery
- **Shadcn/UI** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Seamless deployment platform

---

**Built with ❤️ for the engineering student community**
