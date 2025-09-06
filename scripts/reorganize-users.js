// Firebase Admin Script to Create Email-Based User Collection
// This script helps create a more readable user collection structure

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Instructions:
// 1. Download your Firebase Admin SDK private key from Firebase Console
// 2. Place it in the project root as 'firebase-admin-key.json'
// 3. Run: node scripts/reorganize-users.js

const serviceAccount = require('../firebase-admin-key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function reorganizeUsers() {
  try {
    console.log('🔄 Starting user collection reorganization...');
    
    // Get all users from the current collection
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`📊 Found ${usersSnapshot.size} users to process`);
    
    // Create a new collection with email-based organization
    const batch = db.batch();
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const uid = userDoc.id;
      
      if (userData.email) {
        // Create a more readable document structure
        const emailBasedId = userData.email.replace('@', '_at_').replace(/\./g, '_');
        
        // Add to a new 'users_by_email' collection for easier browsing
        const emailBasedRef = db.collection('users_by_email').doc(emailBasedId);
        batch.set(emailBasedRef, {
          ...userData,
          originalUID: uid,
          displayEmail: userData.email,
          lastUpdated: new Date()
        });
        
        // Update the original document with better display fields
        const originalRef = db.collection('users').doc(uid);
        batch.update(originalRef, {
          _displayEmail: userData.email,
          _readableId: emailBasedId,
          _lastReorganized: new Date()
        });
        
        console.log(`✅ Processed: ${userData.email} (${uid})`);
      }
    }
    
    await batch.commit();
    console.log('🎉 User reorganization completed successfully!');
    
    // Create indexes for better querying
    console.log('📝 Remember to create these indexes in Firebase Console:');
    console.log('- Collection: users_by_email, Field: displayEmail (Ascending)');
    console.log('- Collection: users_by_email, Field: originalUID (Ascending)');
    
  } catch (error) {
    console.error('❌ Error reorganizing users:', error);
  }
}

// Alternative: Simple display improvement without restructuring
async function addDisplayFields() {
  try {
    console.log('🔄 Adding display fields to existing users...');
    
    const usersSnapshot = await db.collection('users').get();
    const batch = db.batch();
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      if (userData.email) {
        const userRef = db.collection('users').doc(userDoc.id);
        batch.update(userRef, {
          _displayEmail: userData.email,
          _displayName: userData.displayName || userData.email.split('@')[0],
          _readableId: userData.email.replace('@', '_at_').replace(/\./g, '_'),
          _lastUpdated: new Date()
        });
        
        console.log(`✅ Updated: ${userData.email}`);
      }
    }
    
    await batch.commit();
    console.log('🎉 Display fields added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding display fields:', error);
  }
}

// Run the simpler approach first
addDisplayFields();
