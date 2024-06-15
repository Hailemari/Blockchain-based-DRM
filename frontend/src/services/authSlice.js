import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
