import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Feature/UserSlice"
export const store=configureStore({
    reducer:{
        user:userReducer,
    }
})