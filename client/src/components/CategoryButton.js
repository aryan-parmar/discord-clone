import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { selectChannel, setChannel } from '../features/channelSlice'
import { selectUser } from '../features/userSlice'
import { selectServer } from '../features/serverSlice'
import { useSelector, useDispatch } from 'react-redux'

import url from "../url.json"
export default function CategoryButton(props) {
    let currentChannel = useSelector(selectChannel)
    let currentUser = useSelector(selectUser)
    let currentServer = useSelector(selectServer)
    let [peer, setPeer] = React.useState([])
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
    React.useEffect(() => {
        socket.on('voice-chat-update-user-list', (channelId, data) => {
            console.log(data)
            if (channelId === id) {
                setPeer(old => [...old, data])
            }
        })
        if (channelType === 'voice') {
            fetch(`${url.server}get/active-peers`, {
                method: "POST",
                credentials: 'include',
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': url.frontend,
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            }).then(response => response.json()).then(res => {
                if (res.error === null) {
                    let a = peer.concat(peer, res.data)
                    setPeer(a)
                }
            })
            socket.emit('get-active-peers',currentUser.id,id)
        }
    }, [])
    function joinVoice(id) {
        socket.emit("voice-chat-join", currentServer.server.id, id, peerId, currentUser.id)
        let data = { displayName: currentUser.name, image: currentUser.profile, key: currentUser.id }
        setPeer(old => [...old, data])
    }
    return (
        <>
            {channelType === 'text' ? (
                <div className={id === currentChannel.channel.channelId ? 'channel-select-btn noselect channel-active' : 'channel-select-btn noselect'} onClick={setCurrentChannel}><h2>#</h2> {name}</div>
            ) : (
                <>
                    <div className="channel-select-btn noselect" onClick={() => joinVoice(id)}><FontAwesomeIcon icon={faVolumeUp} className="icon" />{name}</div>
                    {peer.map((p) => (
                        <div key={p.key} className='voice-chat-peers noselect'>
                            <img src={url.server + p.image} />
                            <h5>{p.displayName}</h5>
                        </div>
                    ))}
                </>
            )}
        </>
    )
}
