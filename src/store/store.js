import {configureStore,createSlice} from '@reduxjs/toolkit'


//user slice for autentication state

const userSlice = createSlice({
    name:"user",
    initialState:{user:null,token:null},
    reducers:{
        login:(state,action)=>{
            state.user = action.payload.token
            state.token = action.payload.token;
        },
        logout:(state)=>{
               state.user = null,
               state.token = null
        }
    }
}
)

export const {login,logout} = userSlice.actions

export const store = configureStore({
    reducer:{
        user:userSlice.reducer
    }
})