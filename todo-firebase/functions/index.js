import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';

admin.initializeApp();

export const taskDeletion = onSchedule("* * * * *", async () => {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000; // 5 minutes in milliseconds

  console.log(`Current time: ${new Date(now).toISOString()}`);
  console.log(`Time 5 minutes ago: ${new Date(fiveMinutesAgo).toISOString()}`);

  const tasks = admin.firestore().collection("tasks")
    .where("status", "==", true)
    .where("updatedAt", "<=", fiveMinutesAgo);

  try {
    const snapshot = await tasks.get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    snapshot.forEach((doc) => {
      
      console.log(`Deleting document with ID: ${doc.id}`);
      doc.ref.delete()
      .then(() => {
        console.log(`Document with ID ${doc.id} successfully deleted`);
      })
      .catch((error) => {
        console.error(`Error deleting document with ID ${doc.id}: `, error);
      });
    });
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
});