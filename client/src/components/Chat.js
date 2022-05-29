import React, { useEffect } from 'react'
import ImojiButton from './ImojiButton'
import ChatDisplay from './ChatDisplay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { selectChannel } from '../features/channelSlice'
import { selectUser } from '../features/userSlice'
import { selectServer } from '../features/serverSlice'
import { useSelector } from 'react-redux'
import url from "../url.json"

export default function Chat(props) {
    let chatContainer = React.createRef();
    const scrollToMyRef = () => {
        const scroll =
            chatContainer.current.scrollHeight -
            chatContainer.current.clientHeight;
        chatContainer.current.scrollTo(0, scroll);
    };
    var socket = props.socket
    let currentChannel = useSelector(selectChannel)
    let currentUser = useSelector(selectUser)
    let currentServer = useSelector(selectServer)
    let [message, setMessage] = React.useState('')
    let [messageList, setMessageList] = React.useState([])
    let [previousMessageList, setPreviousMessageList] = React.useState([])
    let user = props.user
    let [response, setResponse] = React.useState([])
    useEffect(() => {
        socket.on('msg', (a) => { setResponse(a) })
        // socket.on('joined', () => { console.log('you joined') });
        // socket.on('user-connected', () => { console.log("user-connected") })
    }, [])
    useEffect(() => {
        if (response[3] === currentChannel.channel.channelId) {
            // console.log(response)
            setMessageList(b => [...b, response])
        }
    }, [response])
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': url.frontend,
                'Access-Control-Allow-Credentials': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channelId: currentChannel.channel.channelId })
        };
        fetch(`${url.server}api/get/chat`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error === null) {
                    setMessageList([])
                    setPreviousMessageList(data.chat);
                }
            });
        socket.emit('join-room', currentChannel.channel.channelId)
    }, [currentChannel.channel])
    useEffect(() => {
        scrollToMyRef()
    }, [messageList, previousMessageList])
    function handleSubmit(e) {
        e.preventDefault()
        if (message !== '' && !selectedFile) {
            socket.emit('send-msg', message, currentChannel.channel.channelId, currentUser.id, currentServer.server.serverId)
            setMessageList(b => [...b, [message, currentUser.name, currentUser.profile, currentChannel.channel.channelIdx, Date.now(), currentUser.id, "text"]])
            setMessage('')
        }
        if (selectedFile) {
            console.log(selectedFile)
            let selectedFilesrc
            var data = new FormData();
            data.append("file", selectedFile)
            data.append("filename", selectedFile.name)
            fetch(`${url.server}upload-file`, {
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
                    selectedFilesrc = res.data
                    socket.emit('message-with-file', selectedFile.name, selectedFile.size, selectedFilesrc, message, currentChannel.channel.channelId, currentUser.id, currentServer.server.serverId);
                    setMessageList(b => [...b, [message, currentUser.name, currentUser.profile, currentChannel.channel.channelId, Date.now(), currentUser.id, "file", { name: selectedFile.name, size: selectedFile.size, src: selectedFilesrc }]])
                }
            });
            setMessage('')
            setSelectedFile('')
        }
    }
    let [selectedFile, setSelectedFile] = React.useState('')
    function FileChosen(evnt) {
        if (evnt.target.files[0]) {
            setSelectedFile(evnt.target.files[0])
            document.querySelector(".cinput").focus()
        }
    }
    return (
        <div className='chat-section'>
            <div className='chat-header noselect'><h2>#</h2> <h4>{currentChannel.channel.channelName}</h4></div>
            <div className='chat-display' ref={chatContainer}>

                {previousMessageList.map((message, ind) => (
                    <ChatDisplay
                        lastmessage={ind === 0 ? 0 : { id: previousMessageList[ind - 1]["senderId"], date: previousMessageList[ind - 1]['time'] }}
                        key={message._id}
                        from={message.by}
                        profileImage={message.senderProfile}
                        date={message.time}
                        msg={message.message}
                        current={message["senderId"]}
                        type={message.type}
                        filedata={message.filedata}
                    ></ChatDisplay>
                ))}
                {messageList.map((message, ind) => (
                    <ChatDisplay
                        lastmessage={ind === 0 ? previousMessageList[previousMessageList - 1] ? { id: previousMessageList[previousMessageList - 1]["senderId"], date: previousMessageList[previousMessageList - 1]['time'] } : { id: 0, date: "" } : { id: messageList[ind - 1][5], date: messageList[ind - 1][4] }}
                        key={ind} from={message[1]}
                        profileImage={message[2]}
                        date={message[4]}
                        msg={message[0]}
                        current={message[5]}
                        type={message[6]}
                        filedata={message[7]}
                    ></ChatDisplay>
                ))}
            </div>
            <div className='chat-input'>
                {selectedFile !== '' ?
                    <div className='file-name-display'>
                        <FontAwesomeIcon icon={faFile} style={{ margin: '0 2%', fontSize: "1.3rem", color: "rgb(150, 150, 150)", pointerEvents: "none" }} />
                        {selectedFile ? selectedFile.name : ''}
                    </div>
                    : null}
                <div className='chat-input-btns'>
                    <form onSubmit={handleSubmit}>
                        <input type="file" style={{ position: "absolute", opacity: "0", zIndex: "0" }} onChange={(e) => FileChosen(e)} /><FontAwesomeIcon icon={faPlusCircle} style={{ margin: '0 2%', cursor: 'pointer', fontSize: "1.3rem", color: "rgb(150, 150, 150)", pointerEvents: "none" }} />
                        <input type="text" style={{ zIndex: "1" }} className="cinput" placeholder={`Message #${currentChannel.channel.channelName}`} value={message} onChange={(e) => setMessage(e.target.value)} />
                    </form>
                    <div className="gif-icon noselect"><h5>GIF</h5></div>
                    <ImojiButton></ImojiButton>
                </div>
            </div>
        </div>
    )
}