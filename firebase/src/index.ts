import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// User role management function
export const assignUserRole = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // Check if user has admin privileges
  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().doc(`users/${callerUid}`).get();
  const callerData = callerDoc.data();

  if (!callerData || callerData.role !== "Admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can assign roles."
    );
  }

  const { userId, role } = data;

  try {
    await admin.firestore().doc(`users/${userId}`).update({
      role: role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: `Role ${role} assigned to user ${userId}` };
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "Failed to assign role",
      error
    );
  }
});

// Document moderation function
export const moderateDocument = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().doc(`users/${callerUid}`).get();
  const callerData = callerDoc.data();

  if (!callerData || !["Admin", "Moderator"].includes(callerData.role)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins and moderators can moderate content."
    );
  }

  const { documentId, action, note } = data;

  try {
    const docRef = admin.firestore().doc(`documents/${documentId}`);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Document not found."
      );
    }

    const updateData: any = {
      status: action, // 'approved' or 'rejected'
      moderatedBy: callerUid,
      moderatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (note) {
      updateData.moderationNote = note;
    }

    await docRef.update(updateData);

    // Create notification for the document uploader
    const docData = docSnap.data();
    if (docData?.uploadedBy) {
      await admin.firestore().collection("notifications").add({
        userId: docData.uploadedBy,
        type: action === "approved" ? "contribution_approved" : "contribution_rejected",
        title: `Document ${action}`,
        message: `Your document "${docData.title}" has been ${action}.`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        relatedDocumentId: documentId,
      });
    }

    return { success: true, message: `Document ${action} successfully` };
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "Failed to moderate document",
      error
    );
  }
});

// Update user reputation when document is approved
export const updateReputationOnApproval = functions.firestore
  .document("documents/{documentId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Check if document was just approved
    if (beforeData.status === "pending" && afterData.status === "approved") {
      const uploaderId = afterData.uploadedBy;
      
      if (uploaderId) {
        const userRef = admin.firestore().doc(`users/${uploaderId}`);
        
        await userRef.update({
          reputation: admin.firestore.FieldValue.increment(10),
        });

        // Check for badges (e.g., first contribution)
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        
        if (userData && userData.reputation === 10) {
          // Award first contribution badge
          await userRef.update({
            badges: admin.firestore.FieldValue.arrayUnion({
              id: "first_contribution",
              name: "First Contribution",
              description: "Made your first contribution to the platform",
              icon: "🎉",
              earnedAt: admin.firestore.FieldValue.serverTimestamp(),
            }),
          });
        }
      }
    }
  });

// Clean up expired notifications
export const cleanupNotifications = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30); // 30 days old

    const query = admin.firestore()
      .collection("notifications")
      .where("createdAt", "<", cutoff);

    const snapshot = await query.get();
    const batch = admin.firestore().batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    
    console.log(`Cleaned up ${snapshot.size} old notifications`);
    return null;
  });
