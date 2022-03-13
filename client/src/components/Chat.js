import React, { useEffect } from 'react'
import ImojiButton from './ImojiButton'
import ChatDisplay from './ChatDisplay'
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
        socket.on('msg', (a) => {setResponse(a)})
        socket.on('joined', () => { console.log('you joined') });
        socket.on('user-connected', () => { console.log("user-connected") })
    }, [])
    useEffect(() => {
        if (response[3] === currentChannel.channel.channelId) {
            setMessageList(b => [...b, response])
        }
    },[response])
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
        socket.emit('send-msg', message, currentChannel.channel.channelId, currentUser.id,currentServer.server.serverId)
        setMessageList(b => [...b, [message, currentUser.name, currentUser.profile,currentChannel.channel.channelId, Date.now()]])
        setMessage('')
    }

    return (
        <div className='chat-section'>
            <div className='chat-header noselect'><h2>#</h2> <h4>{currentChannel.channel.channelName}</h4></div>
            <div className='chat-display' ref={chatContainer}>

                {previousMessageList.map(message => (
                    <ChatDisplay key={message._id} from={message.by} profileImage={message.senderProfile} date={message.time} msg={message.message}></ChatDisplay>
                ))}
                {messageList.map((message,ind )=> (
                    <ChatDisplay key={ind} from={message[1]} profileImage={message[2]} date={message[4]} msg={message[0]}></ChatDisplay>
                ))}
            </div>
            <div className='chat-input'>
                <div className='chat-input-btns'>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder={`Message #${currentChannel.channel.channelName}`} value={message} onChange={(e) => setMessage(e.target.value)} />
                    </form>
                    <div className="gif-icon noselect"><h5>GIF</h5></div>
                    <ImojiButton></ImojiButton>
                </div>
            </div>
        </div>
    )
}