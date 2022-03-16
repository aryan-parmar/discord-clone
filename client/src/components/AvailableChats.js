import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faUserPlus, faImage } from '@fortawesome/free-solid-svg-icons'
import CategoryButton from './CategoryButton'
import { selectServer } from '../features/serverSlice'
import { selectUser } from '../features/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setChannel } from '../features/channelSlice'
import url from "../url.json"


export default function AvailableChats(props) {
    let [AvailableChannels, setAvailableChannels] = React.useState([])
    let [show, setShow] = React.useState(false)
    let [serverShow, setServerShow] = React.useState(false)
    let currentServer = useSelector(selectServer)
    var socket = props.socket
    let currentUser = useSelector(selectUser)
    const dispatch = useDispatch();
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
                    var notification = new Notification("new message", { body: a[1] + '" : "' + a[0] + '"', icon: url.server + a[2], tag: a[4] })
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
    return (
        <div className='ac'>
            <div className='server-name noselect'><h4>{currentServer.server.serverName}</h4>

                <FontAwesomeIcon icon={faImage} style={{ margin: '6% 1%', marginTop: '7%', cursor: 'pointer' }} className="create-channel" onClick={() => setServerShow(true)} />
                <FontAwesomeIcon icon={faPlusCircle} style={{ margin: '6% 6%', marginTop: '7%', cursor: 'pointer' }} className="create-channel" onClick={CreateChannel} />
            </div>
            <div className="server-channel-display">
                <div style={{ backgroundColor: 'rgb(50, 56, 59)', width: '95%', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: '5px', zIndex: '50' }}
                    onClick={getLink}>
                    <h4 style={{ margin: 0, marginTop: '6%', fontWeight: '600' }}>Feeling lonely ?</h4>
                    <h4 style={{ margin: 0, marginTop: '6%', fontWeight: '600' }}>Invite some friends</h4>
                    <FontAwesomeIcon icon={faUserPlus} style={{ margin: 0, marginTop: '6%', marginBottom: '6%' }} />
                </div>
                {AvailableChannels.map(channels => (
                    <CategoryButton key={channels._id} type={channels.channelType} socket={socket} name={channels.channelName} uid={channels._id}></CategoryButton>
                ))}
            </div>
            <div className="personal-details">
                <img src={url.server + currentUser.profile} onClick={() => setShow(!show)}></img>
                <div className="personal-details-text">
                    <h4>{currentUser.name}</h4>
                    <h5>{`#${currentUser.id.substr(1, 4)}`}</h5>
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
