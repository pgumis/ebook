import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
    name: "userData",
    initialState:{
    },
    reducers: {
        setData(state, action){
            state.userData = action.payload;
        }
    }
})
export const userDataActions = userDataSlice.actions;
export default userDataSlice.reducer;