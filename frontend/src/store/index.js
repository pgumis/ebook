import { configureStore } from "@reduxjs/toolkit";
import viewReducer from "./view";
import userDataReducer from "./userData.js"
import cartReducer from './cart.js';

const store = configureStore({
    reducer: {
        view: viewReducer,
        userData: userDataReducer,
        cart: cartReducer
    },
  });
  
  export default store;
  