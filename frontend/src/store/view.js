import { createSlice } from "@reduxjs/toolkit";

const viewSlice = createSlice({
    name: "view",
    initialState:{
        selectedView: 'home',
        bookDetailsObj: undefined,
        selectedMessage: undefined,
    },
    reducers: {
        changeView(state, action){
            state.selectedView = action.payload;
        },
        setBookDetailsObj(state,action){
            state.bookDetailsObj = action.payload
        },
        setSelectedMessage(state,action){
            state.selectedMessage = action.payload
        },
    }
})
export const viewActions = viewSlice.actions;
export default viewSlice.reducer;