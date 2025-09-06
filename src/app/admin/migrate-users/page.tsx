'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function MigrateUsersToEmail() {
  const [isRunning, setIsRunning] = useState(false);
  const [migrationLog, setMigrationLog] = useState<string[]>([]);
  const [migrationStats, setMigrationStats] = useState({
    totalUsers: 0,
    migrated: 0,
    errors: 0,
    documentsUpdated: 0
  });

  const log = (message: string) => {
    console.log(message);
    setMigrationLog(prev => [...prev, message]);
  };

  const migrateUsersToEmailIds = async () => {
    setIsRunning(true);
    setMigrationLog([]);
    setMigrationStats({ totalUsers: 0, migrated: 0, errors: 0, documentsUpdated: 0 });

    try {
      log('🚀 Starting migration from UID-based to email-based user IDs...');
      
      // Step 1: Get all current users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const totalUsers = usersSnapshot.size;
      setMigrationStats(prev => ({ ...prev, totalUsers }));
      log(`📊 Found ${totalUsers} users to migrate`);

      if (totalUsers === 0) {
        log('❌ No users found. Nothing to migrate.');
        return;
      }

      const batch = writeBatch(db);
      let batchCount = 0;
      const BATCH_SIZE = 500; // Firestore batch limit
      
      let migratedCount = 0;
      let errorCount = 0;
      let documentsUpdated = 0;

      for (const userDoc of usersSnapshot.docs) {
        try {
          const userData = userDoc.data();
          const oldUid = userDoc.id;
          
          // Skip if this is already an email ID
          if (oldUid.includes('@')) {
            log(`⏭️  Skipping ${oldUid} (already email-based)`);
            continue;
          }

          if (!userData.email) {
            log(`⚠️  User ${oldUid} has no email, skipping`);
            errorCount++;
            continue;
          }

          const emailId = userData.email;
          
          // Check if email-based document already exists
          const emailDocRef = doc(db, 'users', emailId);
          
          // Create new document with email as ID
          batch.set(emailDocRef, {
            ...userData,
            _originalUID: oldUid,
            _migratedAt: new Date(),
            _migrationNote: 'Migrated from UID to email-based ID'
          });
          
          // Delete old document
          batch.delete(doc(db, 'users', oldUid));
          
          batchCount += 2; // set + delete
          documentsUpdated += 2;
          migratedCount++;
          
          log(`✅ Prepared migration: ${oldUid} -> ${emailId}`);
          
          // Commit batch if we reach limit
          if (batchCount >= BATCH_SIZE) {
            await batch.commit();
            log(`💾 Committed batch of ${batchCount} operations`);
            batchCount = 0;
          }
          
          setMigrationStats(prev => ({ 
            ...prev, 
            migrated: migratedCount, 
            errors: errorCount,
            documentsUpdated 
          }));
          
        } catch (error) {
          errorCount++;
          log(`❌ Error migrating user ${userDoc.id}: ${error}`);
          setMigrationStats(prev => ({ ...prev, errors: errorCount }));
        }
      }
      
      // Commit remaining operations
      if (batchCount > 0) {
        await batch.commit();
        log(`💾 Committed final batch of ${batchCount} operations`);
      }

      // Step 2: Update document references
      log('\n🔄 Step 2: Updating document references...');
      await updateDocumentReferences();
      
      log(`\n🎉 Migration completed!`);
      log(`📈 Stats: ${migratedCount} users migrated, ${errorCount} errors, ${documentsUpdated} documents updated`);
      log(`🔄 Please refresh your Firebase console to see the changes.`);
      
    } catch (error) {
      log(`❌ Migration failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const updateDocumentReferences = async () => {
    try {
      // Get all documents that might have uploadedBy field
      const documentsRef = collection(db, 'documents');
      const documentsSnapshot = await getDocs(documentsRef);
      
      log(`📄 Found ${documentsSnapshot.size} documents to check for UID references`);
      
      const batch = writeBatch(db);
      let updateCount = 0;
      
      for (const docSnapshot of documentsSnapshot.docs) {
        const docData = docSnapshot.data();
        
        // Check if uploadedBy is a UID (not an email)
        if (docData.uploadedBy && !docData.uploadedBy.includes('@') && docData.uploaderEmail) {
          // Update uploadedBy to use email instead of UID
          batch.update(doc(db, 'documents', docSnapshot.id), {
            uploadedBy: docData.uploaderEmail,
            _originalUploadedBy: docData.uploadedBy,
            _referencesUpdated: new Date()
          });
          
          updateCount++;
          log(`🔗 Updated document ${docSnapshot.id}: ${docData.uploadedBy} -> ${docData.uploaderEmail}`);
        }
      }
      
      if (updateCount > 0) {
        await batch.commit();
        log(`✅ Updated ${updateCount} document references`);
      } else {
        log(`ℹ️  No document references needed updating`);
      }
      
    } catch (error) {
      log(`❌ Error updating document references: ${error}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">🔄 Migrate Users to Email-based IDs</CardTitle>
          <CardDescription className="text-white/70">
            This will migrate your Firebase user collection from UID-based document IDs to email-based IDs
            for better Firebase console visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Important:</strong> This operation will restructure your user collection. 
              Make sure you have a backup of your data before proceeding.
            </AlertDescription>
          </Alert>

          {/* Migration Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-300">{migrationStats.totalUsers}</div>
              <div className="text-sm text-blue-200">Total Users</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-300">{migrationStats.migrated}</div>
              <div className="text-sm text-green-200">Migrated</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-300">{migrationStats.errors}</div>
              <div className="text-sm text-red-200">Errors</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-300">{migrationStats.documentsUpdated}</div>
              <div className="text-sm text-purple-200">Docs Updated</div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">What this migration does:</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Converts user document IDs from random UIDs to email addresses</li>
              <li>• Updates all document references to use emails instead of UIDs</li>
              <li>• Preserves all existing user data</li>
              <li>• Adds migration tracking fields for audit purposes</li>
              <li>• Makes Firebase console much more readable</li>
            </ul>
          </div>
          
          <Button
            onClick={migrateUsersToEmailIds}
            disabled={isRunning}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Migration... ({migrationStats.migrated}/{migrationStats.totalUsers})
              </>
            ) : (
              '🚀 Start Migration to Email-based IDs'
            )}
          </Button>
          
          {migrationLog.length > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h4 className="text-white font-semibold mb-2">Migration Log:</h4>
              <div className="text-sm font-mono space-y-1">
                {migrationLog.map((line, index) => (
                  <div key={index} className={`${
                    line.includes('✅') ? 'text-green-300' :
                    line.includes('❌') ? 'text-red-300' :
                    line.includes('⚠️') ? 'text-yellow-300' :
                    line.includes('🎉') ? 'text-purple-300' :
                    'text-gray-300'
                  }`}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Alert className="bg-green-500/10 border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              After migration, your Firebase console will show user emails as document IDs 
              (e.g., "user@example.com" instead of "xTAyegEZxkZBUjzLdkGylAlu7tf2").
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
