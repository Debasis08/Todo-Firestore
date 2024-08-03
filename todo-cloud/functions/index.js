import taskDeletion from "../schedule";

export {taskDeletion};




























import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";

// Initialize Firebase Admin
initializeApp();

// Set global options
setGlobalOptions({ maxInstances: 10 });

const db = getFirestore();

export const onTaskStatusChanged = onDocumentUpdated("tasks/{taskId}", async (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();
  const taskId = event.params.taskId;


  if (afterData.status === true && beforeData.status === false) {
    console.log(`Task ${taskId} marked as done. Scheduling deletion in 5 minutes.`);

    setTimeout(async () => {
      try {
        const taskDoc = await db.collection("tasks").doc(taskId).get();
        if (taskDoc.exists && taskDoc.data().status === true) {
          await db.collection("tasks").doc(taskId).delete();
          console.log(`Task ${taskId} has been deleted after 5 minutes.`);
        } else {
          console.log(`Task ${taskId} was not deleted: it no longer exists or its status changed.`);
        }
      } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error);
      }
    }, 5 * 60 * 1000);
  }
});