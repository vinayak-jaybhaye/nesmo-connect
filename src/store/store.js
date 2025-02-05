import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import varSlice from './varSlice'


const store = configureStore({
    reducer : {
        auth : authSlice,
        vars : varSlice
    }
})


export default store;