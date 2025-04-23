import { configureStore } from "@reduxjs/toolkit";
import viewReducer from "./view";

const store = configureStore({
    reducer: {
        view: viewReducer
    },
  });
  
  export default store;
  