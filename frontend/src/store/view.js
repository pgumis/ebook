import { createSlice } from "@reduxjs/toolkit";

const viewSlice = createSlice({
    name: "view",
    initialState:{
        selectedView: 'home',
        bookDetailsObj: undefined,
        selectedMessage: undefined,
        selectedItemId: null,
        selectedCategory: null,
        isSearchOverlayVisible: false,
        emailForPasswordReset: null,
    },
    reducers: {
        toggleSearchOverlay(state, action) {
            state.isSearchOverlayVisible = action.payload;
        },
        changeView(state, action){
            if (typeof action.payload === 'string') {
                state.selectedView = action.payload;
                state.selectedItemId = null;
            } else {
                state.selectedView = action.payload.view;
                state.selectedItemId = action.payload.itemId;
            }
        },
        setSelectedItem(state, action) {
            state.selectedItemId = action.payload;
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
        setEmailForPasswordReset(state, action) {
            state.emailForPasswordReset = action.payload;
        },
    }
})
export const viewActions = viewSlice.actions;
export default viewSlice.reducer;