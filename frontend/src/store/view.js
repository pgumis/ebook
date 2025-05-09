import { createSlice } from "@reduxjs/toolkit";

const viewSlice = createSlice({
    name: "view",
    initialState:{
        selectedView: 'Testing'
    },
    reducers: {
        changeView(state, action){
            state.selectedView = action.payload;
        }
    }
})
export const viewActions = viewSlice.actions;
export default viewSlice.reducer;