// UserSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null
     // Changed from 'user' to 'currentUser' for clarity
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
        updateUser: (state, action) => {
            state.currentUser = { 
                ...state.currentUser, 
                ...action.payload 
            };
        },
        updateProfilePhoto: (state, action) => {
            state.currentUser.photoURL = action.payload;
        }
    }
});

export const { login, logout, updateUser, updateProfilePhoto } = userSlice.actions;
export const selectUser = (state) => state.user.currentUser;
export default userSlice.reducer;