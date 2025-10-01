# Setup Guide: Direct Cloudinary Upload for Large Files (>5MB)

## Problem
Files larger than 5MB cannot be uploaded through the Next.js API route due to server limitations.

## Solution
Files **> 5MB** are uploaded **directly from the browser to Cloudinary**, bypassing the Next.js server entirely.

---

## Setup Steps

### 1. Create Unsigned Upload Preset in Cloudinary

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `future_engineers_unsigned` (or any name you prefer)
   - **Signing Mode**: **Unsigned** ⚠️ IMPORTANT
   - **Folder**: Leave empty (we'll set it dynamically)
   - **Access Mode**: **Public**
   - **Unique filename**: **Enabled**
   - **Overwrite**: **Disabled**
   - **Resource type**: **Auto**
5. Click **Save**

### 2. Add Environment Variable

Add this to your `.env.local` file:

```env
# Existing Cloudinary config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NEW: Unsigned upload preset for direct uploads
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=future_engineers_unsigned
```

**Important**: The `NEXT_PUBLIC_` prefix makes it available in the browser!

### 3. Restart Dev Server

```bash
npm run dev
```

---

## How It Works

### Smart Upload Strategy

The system automatically chooses the best upload method:

| File Size | Method | Route | Limit |
|-----------|--------|-------|-------|
| **≤ 5MB** | API Route | `/api/upload` | 50MB (but 5MB safe) |
| **> 5MB** | Direct Upload | Cloudinary API | No limit (browser only) |

### Code Flow

```typescript
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const useDirectUpload = selectedFile.size > FILE_SIZE_LIMIT;

if (useDirectUpload) {
  // Browser → Cloudinary directly (NO server)
  uploadDirectlyToCloudinary(file, userId, onProgress);
} else {
  // Browser → Next.js API → Cloudinary (with logging)
  uploadViaAPI(file, userId, onProgress);
}
```

---

## Benefits

✅ **No file size limit** for browser uploads  
✅ **Faster uploads** (direct to Cloudinary, no proxy)  
✅ **Automatic fallback** for small files (better error tracking)  
✅ **Progress tracking** works for both methods  
✅ **Works on Vercel** (bypasses 4MB serverless limit)  

---

## Security Notes

### Is Unsigned Upload Safe?

**Yes, if configured properly:**

1. ✅ **Upload preset restrictions**: Configure allowed formats, max file size, etc. in Cloudinary
2. ✅ **Client-side validation**: We validate file types before upload
3. ✅ **Firestore security**: Only approved documents are visible
4. ✅ **Folder structure**: Files organized by user ID
5. ✅ **No API keys exposed**: Only cloud name and preset are public

### Recommended Preset Settings

In Cloudinary Upload Preset:
- **Allowed formats**: `pdf,jpg,jpeg,png,webp`
- **Max file size**: `50MB` (adjust as needed)
- **Tags**: `future_engineers,user_upload`
- **Transformation**: None (keep original)
- **Access control**: Public read

---

## Testing

### Test Small File (< 5MB)
1. Upload a 2MB PDF
2. Check console: Should say "Via API route"
3. File uploaded through `/api/upload`

### Test Large File (> 5MB)
1. Upload a 10MB PDF
2. Check console: Should say "Direct to Cloudinary"
3. File uploaded directly to `api.cloudinary.com`

---

## Troubleshooting

### Error: "Cloudinary not configured"
- Make sure `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is in `.env.local`
- Restart dev server after adding env vars

### Error: "Upload preset must be unsigned"
- Go to Cloudinary Settings → Upload → Your preset
- Change **Signing Mode** to **Unsigned**

### Error: "Invalid preset"
- Double-check the preset name matches exactly
- Preset names are case-sensitive

### Large files still fail
- Check browser console for Cloudinary errors
- Verify upload preset exists and is unsigned
- Check preset's max file size setting

---

## Alternative: Signed Upload (More Secure)

For production, you may want signed uploads. This requires:

1. Create API route: `/api/cloudinary-signature`
2. Generate signature with API secret
3. Use signature in upload
4. More complex but more secure

**Current solution (unsigned) is fine for most use cases.**

---

## Next Steps

1. ✅ Create unsigned upload preset in Cloudinary
2. ✅ Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` to `.env.local`
3. ✅ Restart dev server
4. ✅ Test with files > 5MB

**That's it! Large file uploads will now work! 🚀**
