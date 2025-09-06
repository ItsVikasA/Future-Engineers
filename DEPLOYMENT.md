# Deployment Guide for Future Engineers

This guide covers deploying the Future Engineers application to various platforms.

## 🚀 Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and optimizations.

### Prerequisites
- GitHub repository
- Vercel account
- Environment variables ready

### Steps

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Choose the `future_engineers` repository

2. **Configure Environment Variables**
   Add these environment variables in Vercel dashboard:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY=your_private_key

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Admin
   ADMIN_EMAILS=admin1@example.com,admin2@example.com
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Future pushes to main branch will auto-deploy
   - Preview deployments for pull requests

### Domain Configuration
- Add custom domain in Vercel dashboard
- Configure DNS settings
- SSL is automatically handled

## 🐳 Docker Deployment

### Dockerfile
Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
```

## 🌐 Firebase Hosting

### Setup
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

### Configuration
Update `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Deploy
```bash
npm run build
npm run export
firebase deploy --only hosting
```

## 🔧 Environment Setup

### Production Environment Variables
Ensure all required environment variables are set:

- Firebase credentials
- Cloudinary API keys
- Admin email list
- Any third-party service keys

### Security Considerations
- Use environment variables for all secrets
- Never commit `.env.local` to version control
- Rotate API keys regularly
- Use least-privilege access for service accounts

## 📊 Monitoring & Analytics

### Vercel Analytics
Enable in Vercel dashboard for:
- Performance monitoring
- Error tracking
- Usage analytics

### Firebase Analytics
Configure in Firebase console:
- User engagement tracking
- Custom events
- Conversion tracking

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🏥 Health Checks

### API Health Check
Create `pages/api/health.ts`:

```typescript
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### Database Connection Check
Monitor Firebase connectivity and response times.

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables
2. **Authentication Issues**: Verify Firebase configuration
3. **Upload Problems**: Check Cloudinary settings
4. **Performance**: Optimize images and enable caching

### Logs
- Vercel: Check function logs in dashboard
- Docker: Use `docker logs container_id`
- Firebase: Monitor in Firebase console

## 📞 Support

For deployment issues:
- Check Vercel documentation
- Review Firebase hosting guides
- Contact support channels

## 🔄 Updates

### Rolling Updates
- Test in staging environment
- Use feature flags for gradual rollouts
- Monitor error rates during deployment
- Have rollback plan ready

### Database Migrations
- Plan Firestore schema changes
- Update security rules as needed
- Test with production data volume
