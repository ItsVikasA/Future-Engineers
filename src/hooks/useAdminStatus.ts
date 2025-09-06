import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';

export function useAdminStatus() {
  const { user } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.uid) {
        console.log('No user UID found');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Checking admin status for user:', user.uid, user.email);
        
        // Check user document for admin status - try both UID and email as document ID
        let userDoc = null;
        let userData = null;
        
        // First try with UID as document ID
        const userDocRefByUID = doc(db, 'users', user.uid);
        userDoc = await getDoc(userDocRefByUID);
        
        if (userDoc.exists()) {
          userData = userDoc.data();
          console.log('Found user document by UID:', userData);
        } else if (user.email) {
          // Try with email as document ID
          const userDocRefByEmail = doc(db, 'users', user.email);
          userDoc = await getDoc(userDocRefByEmail);
          
          if (userDoc.exists()) {
            userData = userDoc.data();
            console.log('Found user document by email:', userData);
          }
        }
        
        if (userData) {
          const adminStatus = userData.isAdmin === true || userData.role === 'Admin';
          console.log('Admin status:', adminStatus, 'isAdmin:', userData.isAdmin, 'role:', userData.role);
          setIsAdmin(adminStatus);
        } else {
          console.log('User document does not exist');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.uid, user?.email]);

  return { isAdmin, loading };
}
