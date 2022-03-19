import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { selectChannel, setChannel } from '../features/channelSlice'
import { selectUser } from '../features/userSlice'
import { useSelector, useDispatch } from 'react-redux'

import url from "../url.json"
export default function CategoryButton(props) {
    let currentChannel = useSelector(selectChannel)
    let currentUser = useSelector(selectUser)
    const dispatch = useDispatch();
    let name = props.name
    let channelType = props.type
    let socket = props.socket
    let id = props.uid
    let peerId = props.PeerId
    function setCurrentChannel() {
        dispatch(setChannel({
            channelName: name,
            channelId: id
        }))
    }

    function joinVoice(id) {
        socket.emit("voice-chat-join", id, peerId)
    }
    return (
        <>
            {channelType === 'text' ? (
                <div className={id === currentChannel.channel.channelId ? 'channel-select-btn noselect channel-active' : 'channel-select-btn noselect'} onClick={setCurrentChannel}><h2>#</h2> {name}</div>
            ) : (
                <>
                    <div className="channel-select-btn noselect" onClick={() => joinVoice(id)}><FontAwesomeIcon icon={faVolumeUp} className="icon" />{name}</div>
                    {/* <div className='voice-chat-peers noselect'>
                        <img src="http://10.194.1.131:4000/profile/622cd8617bf0f520e08d5c55.gif" />
                        <h5>Aryy</h5>
                    </div> */}
                </>
            )}
        </>
    )
}
