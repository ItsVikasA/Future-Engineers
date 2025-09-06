// User Display Updater
// Run this once to add readable display fields to existing users

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase.js';

export async function updateUserDisplayFields() {
  try {
    console.log('🔄 Updating user display fields...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    console.log(`📊 Found ${snapshot.size} users to update`);
    
    const updatePromises = [];
    
    snapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      
      if (userData.email) {
        const userRef = doc(db, 'users', userDoc.id);
        
        // Add readable fields for Firebase console
        const updateData = {
          _displayEmail: userData.email,
          _displayName: userData.displayName || userData.email.split('@')[0],
          _readableId: userData.email.replace('@', '_at_').replace(/\./g, '_'),
          _lastUpdated: new Date(),
          // Keep original structure intact
          email: userData.email,
          displayName: userData.displayName,
        };
        
        updatePromises.push(
          updateDoc(userRef, updateData).then(() => {
            console.log(`✅ Updated: ${userData.email} -> ${updateData._readableId}`);
          })
        );
      }
    });
    
    await Promise.all(updatePromises);
    console.log('🎉 All user display fields updated successfully!');
    
    console.log('\n📋 What changed:');
    console.log('- Added _displayEmail field for easy identification');
    console.log('- Added _displayName field for readable names');
    console.log('- Added _readableId field for console browsing');
    console.log('- Added _lastUpdated timestamp');
    
  } catch (error) {
    console.error('❌ Error updating user display fields:', error);
  }
}

// Run the update function
// updateUserDisplayFields();
