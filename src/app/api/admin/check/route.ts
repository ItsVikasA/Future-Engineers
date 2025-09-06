import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ isAdmin: false, error: 'No token provided' }, { status: 401 });
    }

    // Check if Firebase Admin is properly initialized
    try {
      // Verify the Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userEmail = decodedToken.email;

      if (!userEmail) {
        return NextResponse.json({ isAdmin: false, error: 'No email in token' }, { status: 401 });
      }

      // Check if user is admin - you can modify this logic based on your backend implementation
      // Option 1: Check against a list of admin emails in environment variables
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      const isAdminByEmail = adminEmails.includes(userEmail);

      // Option 2: Check Firestore for admin status
      const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
      const isAdminByDoc = userDoc.exists && userDoc.data()?.isAdmin === true;

      // Option 3: Check Firebase custom claims
      const isAdminByClaim = decodedToken.admin === true;

      const isAdmin = isAdminByEmail || isAdminByDoc || isAdminByClaim;

      return NextResponse.json({ isAdmin, userEmail });

    } catch (adminError) {
      console.error('Firebase Admin error:', adminError);
      return NextResponse.json({ isAdmin: false, error: 'Firebase Admin not configured' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false, error: 'Server error' }, { status: 500 });
  }
}
