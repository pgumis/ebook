import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
    name: "userData",
    initialState:{
        loggedIn: false,
        userName: 'unknown',
        email: 'unknown',
        phoneNumber: '000000000',
        role: 'unknown',
        profilePic: 'unknown' // kilka obrazkow
    },
    reducers: {
        setData(state, action){
            Object.assign(state, action.payload);
        }
    }
})
export const userDataActions = userDataSlice.actions;
export default userDataSlice.reducer;