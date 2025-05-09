import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
    name: "userData",
    initialState:{
        loggedIn: false,
        userName: 'unknow',
        email: 'unknown',
        phoneNumber: '000000000'
    },
    reducers: {
        setData(state, action){
            Object.assign(state, action.payload);
        }
    }
})
export const userDataActions = userDataSlice.actions;
export default userDataSlice.reducer;