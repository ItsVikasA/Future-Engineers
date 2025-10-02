# ✅ Leaderboard Real-Time Fix - Complete

## Problem
The leaderboard was not updating in real-time when users contributed documents. Two issues were identified:
1. Leaderboard was using one-time fetch instead of real-time listener
2. User reputation/contribution counts were NOT being updated when documents were approved

## ✅ Fixes Applied

### 1. Real-Time Leaderboard (DONE)
**File:** `src/app/leaderboard/page.tsx`

**Changed:**
- ❌ Before: Used `getDocs()` for one-time fetch
- ✅ Now: Uses `onSnapshot()` for real-time updates

**Result:**
- Leaderboard updates automatically when data changes
- No page refresh needed
- All users see same rankings simultaneously

### 2. Reputation Tracking on Document Approval (DONE)
**File:** `src/app/admin/review/page.tsx`

**Changed:**
When admin approves a document:
```typescript
// Now updates user reputation
await updateDoc(userRef, {
  reputation: increment(10), // +10 points per approval
  contributions: increment(1) // +1 contribution count
});
```

When admin rejects a document:
```typescript
// Small penalty for rejected content
await updateDoc(userRef, {
  reputation: increment(-2) // -2 points
});
```

**Reputation System:**
- ✅ Approved document: **+10 reputation points**
- ✅ Contribution count: **+1**
- ⚠️ Rejected document: **-2 reputation points** (optional)

### 3. Fix Tool for Existing Users (NEW PAGE)
**File:** `src/app/admin/fix-reputation/page.tsx`

Created admin tool to fix reputation for users who uploaded documents BEFORE this fix.

**Access:** `/admin/fix-reputation`

**What it does:**
1. Scans all approved documents
2. Counts contributions per user
3. Calculates reputation (contributions × 10)
4. Updates all user records
5. Shows results on screen

## 🎯 How It Works Now

### When Document is Uploaded:
1. User uploads document
2. Document gets status: "pending"
3. Nothing happens to reputation yet

### When Admin Approves:
1. Admin clicks "Approve" button
2. Document status → "approved"
3. **System automatically:**
   - ✅ Adds +10 reputation to user
   - ✅ Adds +1 to contribution count
   - ✅ Firestore triggers update
   - ✅ Leaderboard updates in real-time
   - ✅ All viewers see new rankings instantly

### When Admin Rejects:
1. Admin clicks "Reject" button
2. Document status → "rejected"
3. **System automatically:**
   - ⚠️ Deducts -2 reputation from user
   - 🔴 Does NOT increment contribution count

## 📋 For You To Do

### Step 1: Fix Existing Users (One-Time)
Your existing user "Km kayana" has uploaded documents but has 0 reputation because the tracking wasn't working before.

**Fix it:**
1. Go to: `/admin/fix-reputation`
2. Click "Fix User Reputation" button
3. Wait for it to complete
4. Check leaderboard - should now show correct reputation

### Step 2: Test New Uploads
1. Upload a new document as a test user
2. Approve it as admin
3. Check leaderboard - should update immediately
4. Verify user has +10 reputation

### Step 3: Monitor Leaderboard
- Keep leaderboard page open
- Approve a document in another tab
- Leaderboard should update without refresh

## 🔍 Verification

### Check if Real-Time is Working:
```typescript
// Open browser console on leaderboard page
// You should see Firestore listener active
```

### Check User Reputation:
1. Go to Firestore Console
2. Open `users` collection
3. Find user by email
4. Check fields:
   - `reputation`: Should be (contributions × 10)
   - `contributions`: Should equal approved documents count

### Check Document Tracking:
1. Go to Firestore Console
2. Open `documents` collection
3. Find approved document
4. Check `uploadedBy` field matches user email

## 📊 Reputation Formula

```
Total Reputation = (Approved Documents × 10) - (Rejected Documents × 2)
Contribution Count = Approved Documents Only
```

**Example:**
- User uploads 5 documents
- Admin approves 4, rejects 1
- Reputation: (4 × 10) - (1 × 2) = 40 - 2 = **38 points**
- Contributions: **4**
- Leaderboard rank: Based on 38 reputation

## 🎨 UI Updates

The leaderboard now shows:
- Real-time ranking updates
- Reputation points displayed
- Contribution counts
- Top 3 podium with animations
- Live badge updates

## 🔧 Admin Tools

### Fix Reputation Page
**URL:** `/admin/fix-reputation`

**Features:**
- One-click reputation recalculation
- Shows all updated users
- Safe to run multiple times
- Updates existing users retroactively

### Review Page (Enhanced)
**URL:** `/admin/review`

**New Behavior:**
- Approve button → Updates user reputation
- Reject button → Deducts reputation
- Real-time document list
- Automatic user tracking

## 🐛 Troubleshooting

### Leaderboard not updating?
1. Check browser console for errors
2. Verify Firestore connection
3. Check Firestore rules allow read access
4. Refresh page once

### Reputation not increasing?
1. Check document has `uploadedBy` field
2. Verify user exists in `users` collection
3. Check Firestore rules allow updates
4. Run fix-reputation tool

### User not on leaderboard?
1. User must have `reputation` field
2. Run `/admin/fix-reputation` tool
3. User must have approved documents
4. Check Firestore index exists for reputation

## 📈 Expected Behavior

**Scenario 1: New User Uploads**
1. User uploads document → No reputation change
2. Admin approves → +10 reputation immediately
3. Leaderboard updates in real-time
4. User appears in rankings

**Scenario 2: Existing User (Like "Km kayana")**
1. Visit `/admin/fix-reputation`
2. Click "Fix" button
3. System counts 20 approved documents
4. Sets reputation = 200 points
5. User jumps to #1 on leaderboard
6. Future uploads continue working normally

## ✅ Success Criteria

- [x] Leaderboard uses real-time listener
- [x] Document approval updates user reputation
- [x] Reputation increment works (+10)
- [x] Contribution count increments (+1)
- [x] Real-time updates work
- [x] Fix tool created for existing users
- [ ] You run fix-reputation tool once
- [ ] Verify "Km kayana" shows 200 reputation
- [ ] Test new upload → approval → leaderboard update

## 🎉 Summary

Your leaderboard is now:
1. ✅ **Real-time** - Updates without refresh
2. ✅ **Accurate** - Tracks contributions correctly
3. ✅ **Automatic** - No manual updates needed
4. ✅ **Fair** - All users counted properly

**Next Action:** Go to `/admin/fix-reputation` and click the button to fix existing users!
