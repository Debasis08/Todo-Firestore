import { onDocumentUpdated } from "firebase-functions/v2/firestore";
  
  const taskDeletion = onDocumentUpdated("tasks/WCz4SxzCplzweu5v8XjO",
    async (event) => {
        const data = event.after.data();
        const queue = getFunctions().taskQueue("backupapod");
        const targetUri = await getFunctionUrl("backupapod");
  
        const enqueues = 
              queue.enqueue({date}, {
                scheduleDelaySeconds,
                dispatchDeadlineSeconds: 60 * 5, // 5 minutes
                uri: targetUri,
              });
        
        await enqueues;
      });
  

  export default taskDeletion;