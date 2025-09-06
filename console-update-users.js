// Browser Console Utility to Update User Display Fields
// Paste this into your browser console while on the app to update existing users

// Copy this entire function and paste it in your browser console:
async function updateFirebaseUserDisplayFields() {
  // Check if Firebase is available
  if (typeof window === 'undefined' || !window.firebase) {
    console.error('❌ Firebase not found. Please run this on your app page.');
    return;
  }

  try {
    // Import Firebase functions
    const { collection, getDocs, doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('/src/lib/firebase.js');

    console.log('🔄 Starting user display field update...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    console.log(`📊 Found ${snapshot.size} users to update`);
    
    let updateCount = 0;
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      
      if (userData.email) {
        const userRef = doc(db, 'users', userDoc.id);
        
        const displayFields = {
          _displayEmail: userData.email,
          _displayName: userData.displayName || userData.email.split('@')[0],
          _readableId: userData.email.replace('@', '_at_').replace(/\./g, '_'),
          _lastUpdated: new Date(),
        };
        
        await updateDoc(userRef, displayFields);
        updateCount++;
        
        console.log(`✅ ${updateCount}. Updated: ${userData.email} -> ${displayFields._readableId}`);
      }
    }
    
    console.log(`🎉 Successfully updated ${updateCount} users!`);
    console.log('\n📋 Added fields for better Firebase console display:');
    console.log('• _displayEmail: User email for easy identification');
    console.log('• _displayName: Readable name or email prefix');
    console.log('• _readableId: Email converted to Firebase-safe ID');
    console.log('• _lastUpdated: Timestamp of this update');
    console.log('\n🔄 Refresh your Firebase console to see the changes!');
    
  } catch (error) {
    console.error('❌ Error updating user display fields:', error);
    console.log('💡 Make sure you are signed in and have proper permissions.');
  }
}

// Auto-run the function
updateFirebaseUserDisplayFields();
