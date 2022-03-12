import {createSlice} from '@reduxjs/toolkit'

export const serverSlice = createSlice({
    name: 'server',
    initialState: {
        serverName: null,
        serverId: null,
        serverProfile:null,
        server: {name:'loading'}
    },
    reducers: {
        setServer: (state, action) =>{
            state.server = action.payload;
        }
    }
})
export const {setServer} = serverSlice.actions; 
export const selectServer = (state) =>state.server;
export default serverSlice.reducer;