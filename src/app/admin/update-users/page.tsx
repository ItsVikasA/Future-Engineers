'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function UserDisplayUpdater() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateLog, setUpdateLog] = useState<string[]>([]);
  const [updateCount, setUpdateCount] = useState(0);

  const updateUserDisplayFields = async () => {
    setIsUpdating(true);
    setUpdateLog([]);
    setUpdateCount(0);
    
    try {
      const log = (message: string) => {
        console.log(message);
        setUpdateLog(prev => [...prev, message]);
      };

      log('🔄 Starting user display field update...');
      
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      log(`📊 Found ${snapshot.size} users to update`);
      
      let count = 0;
      
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
          count++;
          setUpdateCount(count);
          
          log(`✅ ${count}. Updated: ${userData.email} -> ${displayFields._readableId}`);
        }
      }
      
      log(`🎉 Successfully updated ${count} users!`);
      log('📋 Added fields for better Firebase console display:');
      log('• _displayEmail: User email for easy identification');
      log('• _displayName: Readable name or email prefix');
      log('• _readableId: Email converted to Firebase-safe ID');
      log('• _lastUpdated: Timestamp of this update');
      log('🔄 Refresh your Firebase console to see the changes!');
      
    } catch (error) {
      console.error('❌ Error updating user display fields:', error);
      setUpdateLog(prev => [...prev, `❌ Error: ${error}`]);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">🔧 Firebase User Display Updater</CardTitle>
          <CardDescription className="text-white/70">
            This utility adds readable display fields to your Firebase user documents for better console viewing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">What this does:</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Adds _displayEmail field for easy user identification</li>
              <li>• Adds _displayName field for readable names</li>
              <li>• Adds _readableId field for console browsing</li>
              <li>• Keeps all existing data intact</li>
            </ul>
          </div>
          
          <Button
            onClick={updateUserDisplayFields}
            disabled={isUpdating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Users... ({updateCount} completed)
              </>
            ) : (
              '🚀 Update User Display Fields'
            )}
          </Button>
          
          {updateLog.length > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <h4 className="text-white font-semibold mb-2">Update Log:</h4>
              <div className="text-sm font-mono space-y-1">
                {updateLog.map((line, index) => (
                  <div key={index} className="text-gray-300">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>⚠️ Note:</strong> This is a one-time utility. After running this successfully, 
              you can remove this component. Future user registrations will automatically include these display fields.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
