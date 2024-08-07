//  src/store/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.status = true;

      if (action.payload) {
        state.user = {
          // status: true,
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName
        };
      } else {
        state.user = null;
        state.status = false;
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.status = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;