import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    vars : {}
}

const varSlice = createSlice({
    name: "vars",
    initialState,
    reducers: {
        setVars: (state, action) => {
            Object.assign(state, action.payload); // Correct way to update state
        }
    }
});



export const { setVars } = varSlice.actions
export default varSlice.reducer