import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCart(state, action) {
      state.items = action.payload.items;
      state.suma = action.payload.suma;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      console.log(action.payload);
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
