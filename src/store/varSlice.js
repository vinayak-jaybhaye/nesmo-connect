import { createSlice } from "@reduxjs/toolkit";


const initialState = {}

const varSlice = createSlice({
    name: "vars",
    initialState,
    reducers: {
        setVars: (state, action) => {
            // Object.assign(state, action.payload); // Correct way to update state
            return { ...state, ...action.payload };
        }
    }
});



export const { setVars } = varSlice.actions
export default varSlice.reducer