import { createSlice } from "@reduxjs/toolkit";

const viewSlice = createSlice({
    name: "view",
    initialState:{
        selectedView: 'home',
        bookDetailsId: undefined,
    },
    reducers: {
        changeView(state, action){
            state.selectedView = action.payload;
        },
        setBookDetailsId(state,action){
            state.bookDetailsId = action.payload
        }
    }
})
export const viewActions = viewSlice.actions;
export default viewSlice.reducer;