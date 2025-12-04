import { configureStore } from "@reduxjs/toolkit";
import  commonSlice  from "./commonSlice";
import  themeSlice  from "./themeSlice";
import  userSlice  from "./userSlice";



export const store = configureStore({
    reducer: {
        user: userSlice,
        common: commonSlice,
        theme: themeSlice,
    },
});
