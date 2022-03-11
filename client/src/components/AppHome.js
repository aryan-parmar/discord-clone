import React from 'react'
import AvailableChats from './AvailableChats'
import ServerList from './ServerList'
import Chat from './Chat'
import ServerMembers from './ServerMembers'
import './css/ServerList.css'
import {selectUser} from '../features/userSlice'
import { useSelector } from 'react-redux'

export default function AppHome(props) {
    const user = useSelector(selectUser)
    return (
        <>
            <div className="full-Body-container" id="app-body">
                <ServerList user={user} socket={props.socket}/>
                <AvailableChats user={user} socket={props.socket}/>
                <Chat user={user} socket={props.socket}/>
                <ServerMembers user={user}/>
            </div>
        </>
    )
}