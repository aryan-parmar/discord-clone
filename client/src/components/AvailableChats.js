import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faUserPlus, faPhoneSlash } from '@fortawesome/free-solid-svg-icons'
import CategoryButton from './CategoryButton'
import { selectServer } from '../features/serverSlice'
import { selectUser } from '../features/userSlice'
import { selectActiveChat, setActiceChat } from '../features/activeChatSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setChannel } from '../features/channelSlice'
import url from "../url.json"
import Peer from 'peerjs';
let peer;
export default function AvailableChats(props) {
    let [AvailableChannels, setAvailableChannels] = React.useState([])
    let [show, setShow] = React.useState(false)
    let [serverShow, setServerShow] = React.useState(false)
    let [myId, setMyId] = React.useState(false)
    let [changeState, setChangeState] = React.useState(false)
    let currentServer = useSelector(selectServer)
    var socket = props.socket
    let currentUser = useSelector(selectUser)
    let currentActiveChannel = useSelector(selectActiveChat)
    const dispatch = useDispatch();
    function addVoice(video, stream) {
        video.srcObject = stream
        video.classList.add('veide')
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        document.querySelector(".chat-display").appendChild(video)
    }
    function CreateChannel() {
        if (currentServer.server !== undefined) {
            let name = prompt('Channel Name')
            let textChannel = window.confirm('Create Text Channel ?')
            fetch(`${url.server}api/register/channel`, {
                method: "POST",
                credentials: 'include',
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': url.frontend,
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name, parent: currentServer.server.serverId, type: textChannel })
            }).then(response => response.json()).then(res => {
                if (res.status === 'done') {
                    getChannels()
                    socket.emit("channel-created", currentServer.server.serverId)
                }
            })
        }
    }

    function getChannels() {
        if (currentServer.server.name !== 'loading') {
            fetch(`${url.server}api/get/channel`, {
                method: "POST",
                credentials: 'include',
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': url.frontend,
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: currentServer.server.serverId })
            }).then(response => response.json()).then(res => {
                if (res.error === null) {
                    setAvailableChannels(res.channels)
                    if (res.channels.length !== 0) {
                        res.channels.some((value, index, arr) => {
                            if (value.channelType === 'text') {
                                dispatch(setChannel({
                                    channelName: value.channelName,
                                    channelId: value._id
                                }))
                            }
                            return value.channelType === 'text'
                        })
                    }
                }
            })
        }
    }
    useEffect(() => {
        socket.on('new-channel', (serverId) => {
            console.log("fek")
            fetch(`${url.server}api/get/channel`, {
                method: "POST",
                credentials: 'include',
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': url.frontend,
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: serverId })
            }).then(response => response.json()).then(res => {
                console.log(res)
                if (res.error === null) {
                    setAvailableChannels(res.channels)
                    if (res.channels.length !== 0) {
                        res.channels.some((value, index, arr) => {
                            if (value.channelType === 'text') {
                                dispatch(setChannel({
                                    channelName: value.channelName,
                                    channelId: value._id
                                }))
                            }
                            return value.channelType === 'text'
                        })
                    }
                }
            })

        })
        Notification.requestPermission();
        socket.on('new-msg', (a) => {
            if (a[5] !== currentUser.id) {
                if (!("Notification" in window)) {
                    console.log("This browser does not support desktop notification");
                } else {
                    var notification = new Notification("new message", { body: a[1] + ' : "' + a[0] + '"', icon: url.server + a[2], tag: a[4] })
                }
            }
        })
    }, [])
    // eslint-disable-next-line
    React.useEffect(() => {
        getChannels()
    }, [currentServer.server])
    function getLink() {
        alert(`Your invite link is : ${url.server}join/${currentServer.server.serverId}`)
    }
    function handleSubmit(e) {
        e.preventDefault()
        if (e.target.file.files[0]) {
            if (show) {
                var data = new FormData();
                data.append("image", e.target.file.files[0])
                fetch(`${url.server}update/userdata`, {
                    method: "POST",
                    credentials: 'include',
                    withCredentials: true,
                    headers: {
                        'Access-Control-Allow-Origin': url.frontend,
                        'Access-Control-Allow-Credentials': 'true',
                        // 'Content-Type': 'multipart/form-data'
                        // 'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: data
                }).then(response => response.json()).then(res => {
                    if (res.status === "Uploaded") {
                        setShow(false)
                    }
                });
            } else if (serverShow) {
                var data = new FormData();
                data.append("image", e.target.file.files[0])
                data.append("serverId", currentServer.server.serverId)
                fetch(`${url.server}update/server`, {
                    method: "POST",
                    credentials: 'include',
                    withCredentials: true,
                    headers: {
                        'Access-Control-Allow-Origin': url.frontend,
                        'Access-Control-Allow-Credentials': 'true',
                    },
                    body: data
                }).then(response => response.json()).then(res => {
                    if (res.status === "Uploaded") {
                        setServerShow(false)
                    }
                });
            }
        }
    }
    function changepreview(e) {
        if (e.target.files[0]) {
            document.querySelector(".preview").src = URL.createObjectURL(e.target.files[0])
        }
    }
    const handleDrop = (e) => {
        e.preventDefault();
        e.dataTransfer.effectAllowed = 'move';
        let files = e.dataTransfer.files;
        if (files[0].type === "image/jpeg" || files[0].type === "image/png" || files[0].type === "image/gif") {
            document.querySelector("#file").files = files
            document.querySelector(".preview").src = URL.createObjectURL(files[0])
        }
    };

    React.useEffect(() => {
        peer = new Peer(undefined, {
            // host: url.peerHost,
            // port: "3001",
            // debug: 3,
            config: {
                'iceServers': [
                    { url: 'stun:stun01.sipphone.com' },
                    { url: 'stun:stun.ekiga.net' },
                    { url: 'stun:stun.fwdnet.net' },
                    { url: 'stun:stun.ideasip.com' },
                    { url: 'stun:stun.iptel.org' },
                    { url: 'stun:stun.rixtelecom.se' },
                    { url: 'stun:stun.schlund.de' },
                    { url: 'stun:stun.l.google.com:19302' },
                    { url: 'stun:stun1.l.google.com:19302' },
                    { url: 'stun:stun2.l.google.com:19302' },
                    { url: 'stun:stun3.l.google.com:19302' },
                    { url: 'stun:stun4.l.google.com:19302' },
                    { url: 'stun:stunserver.org' },
                    { url: 'stun:stun.softjoys.com' },
                    { url: 'stun:stun.voiparound.com' },
                    { url: 'stun:stun.voipbuster.com' },
                    { url: 'stun:stun.voipstunt.com' },
                    { url: 'stun:stun.voxgratia.org' },
                    { url: 'stun:stun.xten.com' },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=udp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=tcp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    }
                ]
            }
        });
        socket.on("voice-chat-new-user", (channelid, userId) => {
            console.log(userId)
            navigator.mediaDevices.getUserMedia({
                // video: { width: 1280, height: 720 },
                video: false,
                audio: true
            }).then(stream => {
                var call = peer.call(userId, stream);
                call.on('stream', function (remoteStream) {
                    const Myvideo = document.createElement('video');
                    Myvideo.classList.add('gg')
                    addVoice(Myvideo, remoteStream)
                });
            }).catch(err => {
                console.log(err)
            })
        })
        peer.on('call', call => {
            console.log('gg')
            navigator.mediaDevices.getUserMedia({
                // video: { width: 1280, height: 720, frameRate: 30 },
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
            setMyId(id)
        })

    }, [changeState])
    function disconnect() {
        peer.destroy()
        fetch(`${url.server}update/active-peers`, {
            method: "POST",
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url.frontend,
                'Access-Control-Allow-Credentials': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: currentUser.id, channelId: currentActiveChannel.active.id })
        }).then(response => response.json()).then(res => {
            if (res.error === null) {
                dispatch(setActiceChat(
                    null
                ))
                setChangeState(!changeState)
                socket.emit('voice-chat-disconnect',currentActiveChannel.active.id,currentUser.id,currentServer.server.serverId)
            }   
        })
    }
    return (
        <div className='ac'>
            <div className='server-name noselect'><h4>{currentServer.server.serverName}</h4>
                {/* <FontAwesomeIcon icon={faImage} style={{ margin: '6% 1%', marginTop: '7%', cursor: 'pointer' }} className="create-channel" onClick={() => setServerShow(true)} /> */}
                <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: '6% 1%', marginTop: '7%', cursor: 'pointer', fill: "white", height: '16px' }} className="create-channel" onClick={() => setServerShow(true)} viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z" /></svg>
                <FontAwesomeIcon icon={faPlusCircle} style={{ margin: '6% 6%', marginTop: '7%', cursor: 'pointer' }} className="create-channel" onClick={CreateChannel} />
            </div>
            <div className="server-channel-display">
                <div style={{ backgroundColor: 'rgb(50, 56, 59)', marginBottom: '3px', width: '95%', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: '5px', zIndex: '50' }}
                    onClick={getLink}>
                    <h4 style={{ margin: 0, marginTop: '5%', fontWeight: '600' }}>Feeling lonely ?</h4>
                    <h4 style={{ margin: 0, marginTop: '5%', fontWeight: '600' }}>Invite some friends</h4>
                    <FontAwesomeIcon icon={faUserPlus} style={{ margin: 0, marginTop: '6%', marginBottom: '6%' }} />
                </div>
                {AvailableChannels.map(channels => (
                    <CategoryButton key={channels._id} PeerId={myId} state={changeState} changeState={setChangeState} type={channels.channelType} socket={socket} name={channels.channelName} uid={channels._id}></CategoryButton>
                ))}
            </div>
            <div className="personal-details">
                {
                    currentActiveChannel.active === null ? <>
                    </> :
                        <div className='disconnect-button'>
                            <h4>{currentActiveChannel.active.name}</h4>
                            <button className='disconnect-button-button' onClick={() => disconnect()}>
                                <FontAwesomeIcon icon={faPhoneSlash} style={{ margin: 0, marginTop: '6%', marginBottom: '6%' }} />
                            </button>
                        </div>
                }
                <div className='details'>
                    <img src={url.server + currentUser.profile} onClick={() => setShow(!show)}></img>
                    <div className="personal-details-text">
                        <h4>{currentUser.name}</h4>
                        <h5>{`#${currentUser.id.substr(1, 4)}`}</h5>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: '6% ', marginRight: '9%', marginTop: '8%', cursor: 'pointer', fill: "white", height: '16px' }} className="create-channel" onClick={() => setShow(!show)} viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z" /></svg>
                </div>
            </div>
            {show || serverShow ?
                <div className="modal">
                    <form onSubmit={(e) => handleSubmit(e)} >
                        <div className='section1' onDrop={(event) => handleDrop(event)}
                            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.effectAllowed = 'move'; }}
                            onDragEnter={(e) => e.preventDefault()}>
                            <span className="profile" onDrop={(event) => handleDrop(event)}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => e.preventDefault()}>
                                <img src={show ? url.server + currentUser.profile : url.server + currentServer.server.serverProfile} className="preview" onDrop={(event) => handleDrop(event)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnter={(e) => e.preventDefault()} />
                                <input type="file" id="file" name="file" className="file ab" accept=".gif, .jpeg, .gif, .jpg" onChange={(e) => changepreview(e)} />
                                <label htmlFor="file" className="ab">change Profile picture</label>
                                <h5>Drag and drop works</h5>
                            </span>
                        </div>
                        <div className="btn-group">
                            <button className='btn login noselect' type="button" onClick={(e) => { e.preventDefault(); setShow(false); setServerShow(false) }}>CANCEL</button>
                            <button className='btn login noselect' type="submit">SAVE</button>
                        </div>
                    </form>
                </div>
                : ""}
            {/* <div className={serverShow ? "modal" : "hide-modal"}>
                <form onSubmit={(e) => handleSubmitServer(e)} >
                    <div className='section1' onDrop={(event) => handleDrop2(event)}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.effectAllowed = 'move'; }}
                        onDragEnter={(e) => e.preventDefault()}>
                        <span className="profile" onDrop={(event) => handleDrop2(event)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => e.preventDefault()}>
                            <img src={url.server + currentServer.server.serverProfile} className="preview2" onDrop={(event) => handleDrop2(event)}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => e.preventDefault()} />
                            <input type="file" id="file2" name="file" className="file ab" accept=".gif, .jpeg, .gif, .jpg" onChange={(e) => changepreview2(e)} />
                            <label htmlFor="file" className="ab">change Profile picture</label>
                            <h5>Drag and drop works</h5>
                        </span>
                    </div>
                    <div className="btn-group">
                        <a className='btn login noselect' onClick={() => setServerShow(false)}>CANCEL</a>
                        <button className='btn login noselect' onClick={() => setShow(false)} type="submit">SAVE</button>
                    </div>
                </form>
            </div> */}
        </div>
    )
}
