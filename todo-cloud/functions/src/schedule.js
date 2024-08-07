// import { onDocumentUpdated } from "firebase-functions/v2/firestore";
  
//   const taskDeletion = onDocumentUpdated("tasks/{taskId}",
//     async (event) => {
//         const data = event.after.data();
        
//         if (data.status === true) {
//         setTimeout(() => {
//           event.after.ref.delete();
//         }, 5 * 60 * 1000);

//       }});
  

//   export default taskDeletion;