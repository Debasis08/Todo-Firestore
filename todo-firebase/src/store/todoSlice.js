import { createSlice } from '@reduxjs/toolkit';
import { getAuth } from "firebase/auth";


const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    tasks: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const auth = getAuth();
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        if(action.payload.ownerId === auth.currentUser.uid) {
        state.tasks[index] = action.payload;
      } else {
        state.tasks[index] = state.tasks.find((task) => task.id === action.payload.id);
      }
    }},
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    reorderTasks: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.tasks.splice(sourceIndex, 1);
      state.tasks.splice(destinationIndex, 0, removed);
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask, reorderTasks } = todoSlice.actions;
export default todoSlice.reducer;