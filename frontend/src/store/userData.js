import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    loggedIn: false,
    id: null,
    userName: "",
    email: "",
    imie: "",
    nazwisko: "",
    phoneNumber: "",
    role: "",
    profilePic: "",
    token: "",
  },
  reducers: {
    setData(state, action) {
      Object.assign(state, action.payload);
    },
    clearData(state) {
      return {
        loggedIn: false,
        id: null,
        userName: "",
        email: "",
        imie: "",
        nazwisko: "",
        phoneNumber: "",
        role: "",
        profilePic: "",
        token: "",
      };
    },
  },
});
export const userDataActions = userDataSlice.actions;
export default userDataSlice.reducer;
