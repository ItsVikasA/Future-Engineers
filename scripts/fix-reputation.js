// One-time script to fix existing users' reputation
// Run this in browser console on your app (when logged in as admin)

const fixExistingUserReputation = async () => {
  console.log('🔧 Starting reputation fix for existing users...');
  
  try {
    // Import Firebase modules
    const { collection, getDocs, doc, updateDoc, query, where } = await import('firebase/firestore');
    const { db } = await import('./src/lib/firebase');
    
    // Get all approved documents
    const documentsQuery = query(
      collection(db, 'documents'),
      where('status', '==', 'approved')
    );
    
    const documentsSnapshot = await getDocs(documentsQuery);
    console.log(`📚 Found ${documentsSnapshot.size} approved documents`);
    
    // Count contributions per user
    const userContributions = new Map();
    
    documentsSnapshot.forEach((doc) => {
      const data = doc.data();
      const uploaderId = data.uploadedBy;
      
      if (uploaderId) {
        const current = userContributions.get(uploaderId) || 0;
        userContributions.set(uploaderId, current + 1);
      }
    });
    
    console.log(`👥 Found ${userContributions.size} users with contributions`);
    
    // Update each user's reputation and contribution count
    let updatedCount = 0;
    for (const [userId, count] of userContributions.entries()) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          reputation: count * 10, // 10 points per approved document
          contributions: count
        });
        console.log(`✅ Updated ${userId}: ${count} contributions, ${count * 10} reputation`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Failed to update ${userId}:`, error);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} users!`);
    console.log('🎉 Reputation fix complete!');
    
  } catch (error) {
    console.error('❌ Error fixing reputation:', error);
  }
};

// Run the fix
fixExistingUserReputation();
