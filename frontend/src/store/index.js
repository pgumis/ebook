import { configureStore } from "@reduxjs/toolkit";
import viewReducer from "./view";
import userDataReducer from "./userData.js"

const store = configureStore({
    reducer: {
        view: viewReducer,
        userData: userDataReducer
    },
  });
  
  export default store;
  