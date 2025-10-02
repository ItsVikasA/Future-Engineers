# Cloudinary Upload Error 400 - Troubleshooting Guide

## ❌ Error: "400 Bad Request" from Cloudinary

You're getting a 400 error when uploading files directly to Cloudinary. This typically means the upload preset is not configured correctly.

---

## 🔍 Common Causes

### 1. **Upload Preset is in "Signed" Mode**
**Most Common Issue** ⚠️

The upload preset must be set to **"Unsigned"** for direct browser uploads.

**Fix:**
1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Click **Settings** (gear icon) → **Upload**
3. Scroll to **Upload presets** section
4. Find your preset: **"future_engineers"**
5. Click **Edit** (pencil icon)
6. **Signing Mode**: Change from "Signed" to **"Unsigned"**
7. Click **Save**

### 2. **Upload Preset Doesn't Exist**
The preset name in your code doesn't match what's in Cloudinary.

**Fix:**
1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/) → Settings → Upload
2. Check if preset **"future_engineers"** exists
3. If not, create one:
   - Click **Add upload preset**
   - Preset name: `future_engineers`
   - Signing mode: **Unsigned**
   - Folder: (leave empty or set custom)
   - Click **Save**

### 3. **Resource Type Mismatch**
Uploading to wrong resource type (image vs raw).

**Fix:**
The code currently uploads to `/upload` endpoint which is for images. For PDFs, you might need `/raw/upload`.

### 4. **Folder Permissions**
The folder you're trying to upload to has restrictions.

**Fix:**
In upload preset settings, ensure "Folder" field is empty or accessible.

---

## ✅ Step-by-Step Solution

### **Step 1: Verify Upload Preset Exists**

1. Login to [Cloudinary Console](https://console.cloudinary.com/)
2. Go to **Settings** (⚙️) → **Upload** tab
3. Scroll down to **"Upload presets"** section
4. Look for preset named **"future_engineers"**

**If it doesn't exist:**
- Click **"Add upload preset"**
- Continue to Step 2

**If it exists:**
- Click the **Edit** (pencil) icon
- Continue to Step 2

### **Step 2: Configure Upload Preset**

Set these values:

```
Preset name: future_engineers
Signing mode: Unsigned ⬅️ CRITICAL!
Folder: (leave empty or use: future_engineers)
Access mode: Public
Allowed formats: pdf,jpg,jpeg,png,webp
Max file size: 52428800 (50MB in bytes)
```

**Other settings (optional):**
- Discard original filename: No
- Use filename: Yes
- Unique filename: Yes
- Overwrite: No

Click **Save**

### **Step 3: Test Upload Preset**

Open browser console and run this test:

```javascript
// Test direct upload
const testFile = new File(["test content"], "test.pdf", { type: "application/pdf" });
const formData = new FormData();
formData.append('file', testFile);
formData.append('upload_preset', 'future_engineers');

fetch('https://api.cloudinary.com/v1_1/daf87l22y/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

**Expected response:**
```json
{
  "secure_url": "https://res.cloudinary.com/...",
  "public_id": "...",
  "asset_id": "...",
  ...
}
```

**If you get 400 error:**
- Upload preset is still in "Signed" mode
- Preset name is wrong
- Cloud name is wrong

### **Step 4: Change Resource Type (If PDFs Still Fail)**

PDFs might need to use `/raw/upload` endpoint instead of `/upload`.

Update `src/lib/directCloudinaryUpload.ts`:

```typescript
// Change this line (around line 96):
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

// To this:
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
```

---

## 🔧 Quick Fix Script

Run this in your browser console on the contribute page to test the exact upload:

```javascript
// Get upload preset info
fetch(`https://api.cloudinary.com/v1_1/daf87l22y/upload_presets/future_engineers`)
  .then(res => res.json())
  .then(data => {
    console.log('Upload Preset Info:', data);
    if (data.unsigned === false) {
      console.error('❌ PROBLEM: Preset is in SIGNED mode. Change to UNSIGNED!');
    } else {
      console.log('✅ Preset is unsigned');
    }
  })
  .catch(err => console.error('Error fetching preset:', err));
```

---

## 📊 Debug Checklist

When upload fails with 400, check:

- [ ] Upload preset exists in Cloudinary dashboard
- [ ] Preset name matches: `future_engineers`
- [ ] Signing mode is: **Unsigned**
- [ ] Cloud name matches: `daf87l22y`
- [ ] Environment variable is set: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=future_engineers`
- [ ] `.env` or `.env.local` file is in project root
- [ ] Restarted dev server after changing `.env` (`npm run dev`)
- [ ] No typos in preset name (case-sensitive!)
- [ ] Cleared browser cache

---

## 🔄 Alternative: Use Raw Upload Endpoint

If standard upload doesn't work, try raw upload for PDFs:

### Option A: Update Direct Upload Function

**File:** `src/lib/directCloudinaryUpload.ts`

Change line ~96:

```typescript
// OLD
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

// NEW - For PDFs and other non-image files
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
```

### Option B: Use Resource Type Parameter

Add resource type to form data:

```typescript
formData.append('file', file);
formData.append('upload_preset', uploadPreset);
formData.append('resource_type', 'raw'); // Add this line
formData.append('folder', `future_engineers/${userId}`);
```

---

## 🆘 Still Not Working?

### Get Detailed Error Info

Update your upload function to log the response:

**File:** `src/lib/directCloudinaryUpload.ts`

Update the error handler (around line 60):

```typescript
xhr.addEventListener('load', () => {
  console.log('📤 Upload completed, status:', xhr.status);
  console.log('📝 Response text:', xhr.responseText); // ADD THIS LINE
  
  if (xhr.status < 200 || xhr.status >= 300) {
    console.error('❌ Upload failed with status:', xhr.status);
    console.error('❌ Error details:', xhr.responseText); // ADD THIS LINE
    resolve({
      success: false,
      error: `Upload failed with status ${xhr.status}: ${xhr.responseText}`
    });
    return;
  }
  // ... rest of code
});
```

This will show you the exact error message from Cloudinary.

### Common Error Messages:

**"Invalid signature"**
- Preset is in Signed mode → Change to Unsigned

**"Upload preset not found"**
- Preset name is wrong or doesn't exist

**"Unauthorized"**
- API keys wrong or preset has restrictions

**"Invalid resource_type"**
- Using wrong endpoint for file type

---

## ✅ Verification Steps

After fixing:

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Reload page

3. **Test upload:**
   - Go to contribute page
   - Select a small PDF (< 1MB)
   - Click upload
   - Check console for success message

4. **Expected console output:**
   ```
   🚀 Starting direct Cloudinary upload: file.pdf 123456
   📡 Uploading to: https://api.cloudinary.com/v1_1/daf87l22y/upload
   📊 Upload progress: 100%
   📤 Upload completed, status: 200
   ✅ Cloudinary response: {secure_url: "...", public_id: "..."}
   ```

---

## 📞 Need More Help?

If you're still stuck:

1. **Check Cloudinary Status**: [status.cloudinary.com](https://status.cloudinary.com/)
2. **View Cloudinary Logs**: Dashboard → Reports → Usage
3. **Contact Support**: Cloudinary support (for paid plans)

---

## 🎯 Summary

**Most likely fix:**
1. Go to Cloudinary Dashboard → Settings → Upload
2. Find "future_engineers" preset
3. Change Signing Mode from "Signed" to **"Unsigned"**
4. Save
5. Restart your dev server
6. Try uploading again

**That should fix the 400 error!** ✅
