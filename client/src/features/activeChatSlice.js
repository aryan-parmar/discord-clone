import {createSlice} from '@reduxjs/toolkit'

export const activeChatSlice = createSlice({
    name: 'active',
    initialState: {
        active :null
    },
    reducers: {
        setActiceChat: (state, action) =>{
            state.active = action.payload;
        }
    }
})
export const {setActiceChat} = activeChatSlice.actions; 
export const selectActiveChat = (state) =>state.active;
export default activeChatSlice.reducer;