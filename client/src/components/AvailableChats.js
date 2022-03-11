import React , {useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import CategoryButton from './CategoryButton'
import { selectServer } from '../features/serverSlice'
import { selectUser } from '../features/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setChannel } from '../features/channelSlice'
import url from "../url.json"


export default function AvailableChats(props) {
    let [AvailableChannels, setAvailableChannels] = React.useState([])
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
        socket.on('new-msg',(a)=>{
            alert(`${a[1]} says ${a[0]}`)
        })
    }, [])
    // eslint-disable-next-line
    React.useEffect(() => {
        getChannels()
    }, [currentServer.server])
    function getLink(){
        alert(`Your invite link is : ${url.server}join/${currentServer.server.serverId}`)
    }
    return (
        <div className='ac'>
            <div className='server-name noselect'><h4>{currentServer.server.serverName}</h4>
            
            <FontAwesomeIcon icon={faPlusCircle} style={{ margin: '6% 7%', marginTop: '7%', cursor: 'pointer' }} className="create-channel" onClick={CreateChannel} /></div>
            <div className="server-channel-display">
                <div style={{backgroundColor: 'rgb(50, 56, 59)',width: '95%',color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky',top:'5px', zIndex:'50'}}
                onClick={getLink}>
                <h4 style={{margin: 0, marginTop: '6%', fontWeight:'600'}}>Feeling lonely ?</h4>
                <h4 style={{margin: 0, marginTop: '6%', fontWeight:'600'}}>Invite some friends</h4>
                <FontAwesomeIcon icon={faUserPlus} style={{margin: 0, marginTop: '6%', marginBottom: '6%'}}/>
                </div>
                {AvailableChannels.map(channels => (
                    <CategoryButton key={channels._id} type={channels.channelType} name={channels.channelName} uid={channels._id}></CategoryButton>
                ))}
            </div>
            <div className="personal-details">
                <img src={currentUser.profile}></img>
                <div className="personal-details-text">
                    <h4>{currentUser.name}</h4>
                    <h5>{`#${currentUser.id.substr(1, 4)}`}</h5>
                </div>
            </div>
        </div>
    )
}
