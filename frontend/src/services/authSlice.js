import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify({
        token: action.payload.token 
      }));
    },
  },
});

export const selectAuth = (state) => state.auth;
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
