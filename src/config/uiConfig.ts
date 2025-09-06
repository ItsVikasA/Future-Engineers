// Modern UI Configuration
export const uiConfig = {
  theme: {
    name: "Modern",
    palette: {
      primary: "#007BFF",
      secondary: "#6C757D", 
      background: "#FFFFFF",
      surface: "#F8F9FA",
      textPrimary: "#212529",
      textSecondary: "#6C757D",
      accent: "#28A745",
      warning: "#FFC107",
      error: "#DC3545"
    },
    typography: {
      fontFamily: "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
      headerSize: "2rem",
      bodySize: "1rem",
      smallSize: "0.875rem"
    },
    layout: {
      style: "component-based",
      spacing: "1rem",
      useMinimalistIcons: true,
      borderRadius: "0.5rem",
      cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    }
  },
  userRoles: {
    admin: {
      dashboard: {
        title: "Admin Dashboard", 
        layout: "grid",
        components: [
          {
            type: "StatCard",
            title: "Total Users",
            valueKey: "totalUsers", 
            description: "Total active users on the platform.",
            icon: "Users"
          },
          {
            type: "StatCard",
            title: "Content Uploads",
            valueKey: "contentUploadsToday",
            description: "Resources uploaded in the last 24 hours.",
            icon: "Upload"
          },
          {
            type: "StatCard", 
            title: "Pending Reviews",
            valueKey: "pendingReviews",
            description: "Documents awaiting moderation.",
            icon: "Clock"
          },
          {
            type: "DataTable",
            title: "Recent Activity",
            apiEndpoint: "/api/admin/recent-activity",
            columns: ["user", "action", "timestamp"]
          },
          {
            type: "QuickActions",
            title: "Admin Tools", 
            actions: [
              {
                label: "Manage Users",
                target: "/admin/users",
                icon: "UserCog"
              },
              {
                label: "Content Moderation", 
                target: "/admin/content",
                icon: "FileCheck"
              },
              {
                label: "System Settings",
                target: "/admin/settings", 
                icon: "Settings"
              }
            ]
          }
        ]
      },
      navigation: [
        { label: "Dashboard", target: "/admin/dashboard", icon: "LayoutDashboard" },
        { label: "User Management", target: "/admin/users", icon: "Users" },
        { label: "Content Moderation", target: "/admin/content", icon: "FileCheck" },
        { label: "Analytics", target: "/admin/analytics", icon: "BarChart3" },
        { label: "Settings", target: "/admin/settings", icon: "Settings" }
      ]
    },
    user: {
      dashboard: {
        title: "Welcome Back!",
        layout: "modern-grid",
        components: [
          {
            type: "ProfileCard",
            title: "My Profile",
            content: "Manage your profile, upload photo, and update preferences.",
            action: {
              label: "Edit Profile",
              target: "/profile/edit"
            }
          },
          {
            type: "StatsOverview",
            title: "My Statistics",
            metrics: ["uploads", "downloads", "reputation", "contributions"]
          },
          {
            type: "RecentActivity",
            title: "Recent Activity", 
            apiEndpoint: "/api/user/activity",
            displayLimit: 5
          },
          {
            type: "ResourceList",
            title: "My Recent Uploads",
            apiEndpoint: "/api/user/my-resources",
            displayLimit: 3
          }
        ]
      },
      navigation: [
        { label: "Home", target: "/", icon: "Home" },
        { label: "Browse", target: "/browse", icon: "Search" },
        { label: "Resources", target: "/resources", icon: "BookOpen" },
        { label: "Contribute", target: "/contribute", icon: "Plus" },
        { label: "Leaderboard", target: "/leaderboard", icon: "Trophy" },
        { label: "Profile", target: "/profile", icon: "User" }
      ]
    }
  }
};

export default uiConfig;
