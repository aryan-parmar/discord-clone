import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { selectChannel, setChannel } from '../features/channelSlice'
import { useSelector, useDispatch} from 'react-redux'
// import Peer from 'peerjs';
// import url from "../url.json"
export default function CategoryButton(props) {
    let currentChannel = useSelector(selectChannel)
    const dispatch = useDispatch();
    let name = props.name
    let channelType = props.type
    let id = props.uid
    function setCurrentChannel() {
        dispatch(setChannel({
            channelName:name,
            channelId: id
        }))
    }
    return (
        <>
            {channelType === 'text' ? (
            <div className={id===currentChannel.channel.channelId ?'channel-select-btn noselect channel-active': 'channel-select-btn noselect'}onClick={setCurrentChannel}><h2>#</h2> {name}</div>
            ):(
            <div className="channel-select-btn noselect"><FontAwesomeIcon icon={faVolumeUp} className="icon"/>{name}</div>
            )}
        </>
    )
}
