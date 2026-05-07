import { configureStore } from "@reduxjs/toolkit";
import userSlice from './UserSlice'
import cartSlice from './CartSlice'

export const store=configureStore({
    reducer:{
        user:userSlice,
        cart:cartSlice
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch