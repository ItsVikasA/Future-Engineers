'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FixReputationPage() {
  const isAdmin = useAdminStatus();
  const router = useRouter();
  const [isFixing, setIsFixing] = useState(false);
  const [results, setResults] = useState<{ userId: string; contributions: number; reputation: number }[]>([]);

  const fixUserReputation = async () => {
    setIsFixing(true);
    setResults([]);
    
    try {
      toast.loading('Calculating user reputation...', { id: 'fix-reputation' });
      
      // Get all approved documents
      const documentsQuery = query(
        collection(db, 'documents'),
        where('status', '==', 'approved')
      );
      
      const documentsSnapshot = await getDocs(documentsQuery);
      console.log(`📚 Found ${documentsSnapshot.size} approved documents`);
      
      // Count contributions per user
      const userContributions = new Map<string, number>();
      
      documentsSnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const uploaderId = data.uploadedBy;
        
        if (uploaderId) {
          const current = userContributions.get(uploaderId) || 0;
          userContributions.set(uploaderId, current + 1);
        }
      });
      
      console.log(`👥 Found ${userContributions.size} users with contributions`);
      
      // Update each user's reputation and contribution count
      const updatedUsers = [];
      let updatedCount = 0;
      
      for (const [userId, count] of userContributions.entries()) {
        try {
          const userRef = doc(db, 'users', userId);
          const reputation = count * 10; // 10 points per approved document
          
          await updateDoc(userRef, {
            reputation: reputation,
            contributions: count
          });
          
          updatedUsers.push({ userId, contributions: count, reputation });
          console.log(`✅ Updated ${userId}: ${count} contributions, ${reputation} reputation`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Failed to update ${userId}:`, error);
        }
      }
      
      setResults(updatedUsers);
      toast.success(`✅ Updated ${updatedCount} users!`, { id: 'fix-reputation' });
      
    } catch (error) {
      console.error('❌ Error fixing reputation:', error);
      toast.error('Failed to fix reputation', { id: 'fix-reputation' });
    } finally {
      setIsFixing(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/admin')}
            className="border-border mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 mb-2">
            <Award className="h-8 w-8 text-yellow-500" />
            Fix User Reputation
          </h1>
          <p className="text-muted-foreground">
            Recalculate and update reputation for all users based on their approved documents
          </p>
        </div>

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              Reputation Calculator
            </CardTitle>
            <CardDescription>
              This will scan all approved documents and update each user&apos;s reputation and contribution count.
              Each approved document awards 10 reputation points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={fixUserReputation}
              disabled={isFixing}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {isFixing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Fix User Reputation
                </>
              )}
            </Button>
            
            <div className="mt-4 text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Counts all approved documents per user
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Awards 10 reputation points per approved document
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Updates leaderboard in real-time
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-500">ℹ</span>
                Safe to run multiple times
              </p>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Updated Users ({results.length})
              </CardTitle>
              <CardDescription>
                Successfully updated reputation for these users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <div
                    key={result.userId}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{result.userId}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.contributions} contribution{result.contributions !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                        <Award className="h-3 w-3 mr-1" />
                        {result.reputation} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  );
}
