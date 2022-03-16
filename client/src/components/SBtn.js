import React, { useEffect } from 'react'
import {setServer} from '../features/serverSlice'
import { selectServer } from '../features/serverSlice'
import { useSelector, useDispatch} from 'react-redux'
import url from "../url.json"

export default function SBtn(props) {
    let currentServer = useSelector(selectServer)
    const dispatch = useDispatch();
    let profile = props.profile
    let name = props.name
    let id = props.uid
    function setCurrentServer(name, id) {
        dispatch(setServer({
            serverName:name,
            serverId: id,
            serverProfile: profile
        }))
    }
    return (
        <>
            <div onClick={()=>{setCurrentServer(name, id)}}>
                <div className={id===currentServer.server.serverId ?'active-server circle-btn square-btn': 'circle-btn'} data-name={name}><img src={url.server+profile} alt={name} className="server-image" /></div>
            </div>
        </>
    )
}
