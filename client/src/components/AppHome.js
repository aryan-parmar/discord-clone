import React from 'react'
import AvailableChats from './AvailableChats'
import ServerList from './ServerList'
import Chat from './Chat'
import ServerMembers from './ServerMembers'
import './css/ServerList.css'
import {selectUser} from '../features/userSlice'
import url from "../url.json"
import { useSelector } from 'react-redux'
import socketIOClient from "socket.io-client"
var socket = socketIOClient(url.server);

export default function AppHome(props) {
    const user = useSelector(selectUser)
    return (
        <>
            <div className="full-Body-container" id="app-body">
                <ServerList user={user} socket={socket}/>
                <AvailableChats user={user} socket={socket}/>
                <Chat user={user} socket={socket}/>
                <ServerMembers user={user} socket={socket}/>
            </div>
        </>
    )
}