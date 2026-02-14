import { createSlice } from "@reduxjs/toolkit";

const persisted = JSON.parse(localStorage.getItem("fixora_auth") || "null");

const initialState = {
  accessToken: persisted?.accessToken || "",
  user: persisted?.user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("fixora_auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.accessToken = "";
      state.user = null;
      localStorage.removeItem("fixora_auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
