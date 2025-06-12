import { createSlice } from "@reduxjs/toolkit";

const viewSlice = createSlice({
    name: "view",
    initialState:{
        selectedView: 'home',
        bookDetailsObj: undefined,
        selectedMessage: undefined,
        selectedItemId: null,
        selectedCategory: null,
    },
    reducers: {
        changeView(state, action){
            if (typeof action.payload === 'string') {
                state.selectedView = action.payload;
                state.selectedItemId = null;
            } else {
                state.selectedView = action.payload.view;
                state.selectedItemId = action.payload.itemId;
            }
        },
        setBookDetailsObj(state,action){
            state.bookDetailsObj = action.payload
        },
        setSelectedMessage(state,action){
            state.selectedMessage = action.payload
        },
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
    }
})
export const viewActions = viewSlice.actions;
export default viewSlice.reducer;