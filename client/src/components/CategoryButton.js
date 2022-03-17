import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { selectChannel, setChannel } from '../features/channelSlice'
import { selectUser } from '../features/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import Peer from 'peerjs';
import url from "../url.json"
let myPeerId;
export default function CategoryButton(props) {
    let currentChannel = useSelector(selectChannel)
    let currentUser = useSelector(selectUser)
    const dispatch = useDispatch();
    let name = props.name
    let channelType = props.type
    let socket = props.socket
    let id = props.uid
    function setCurrentChannel() {
        dispatch(setChannel({
            channelName: name,
            channelId: id
        }))
    }
    function addVoice(video, stream) {
        video.srcObject = stream
        video.classList.add('veide')
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        // document.querySelector(".chat-display").appendChild(video)
    }
    React.useEffect(() => {
        let peer = new Peer(undefined, {
            host: url.peerHost,
            port: "3001",
            debug: 3,
            config: {
                'iceServers': [
                    {
                        'url': 'stun:stun.l.google.com:19302',
                        'url': 'stun:stun1.l.google.com:19302',
                    },
                ]
            }
        });

        socket.on("voice-chat-new-user", (channelid, userId) => {
            console.log(userId)
            navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            }).then(stream => {
                var call = peer.call(userId, stream);
                call.on('stream', function (remoteStream) {
                    const video = document.createElement('video');
                    addVoice(video, remoteStream)
                });
            }).catch(err => {
                console.log(err)
            })
        })
        peer.on('call', call => {
            navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            }).then(stream => {
                call.answer(stream)
                const video = document.createElement('video');
                call.on('stream', (remoteStream) => {
                    addVoice(video, remoteStream)
                })
            })
        })
        peer.on('open', id => {
            console.log(id)
            myPeerId = id
        })
    }, [])
    function joinVoice(id) {
        // navigator.mediaDevices.getUserMedia({
        //     video: true,
        //     audio: true
        // }).then(stream => {
        //     const video = document.createElement('video');
        //     video.muted = true
        //     addVoice(video, stream)
        // })
        socket.emit("voice-chat-join", id, myPeerId)
    }
    return (
        <>
            {channelType === 'text' ? (
                <div className={id === currentChannel.channel.channelId ? 'channel-select-btn noselect channel-active' : 'channel-select-btn noselect'} onClick={setCurrentChannel}><h2>#</h2> {name}</div>
            ) : (
                <div className="channel-select-btn noselect" onClick={() => joinVoice(id)}><FontAwesomeIcon icon={faVolumeUp} className="icon" />{name}</div>
            )}
        </>
    )
}
