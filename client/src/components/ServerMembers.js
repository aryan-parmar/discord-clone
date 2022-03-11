import React from 'react'
import MemberName from './MemberName'
import { selectServer } from '../features/serverSlice'
import { useSelector } from 'react-redux'
import url from "../url.json"

export default function ServerMembers(props) {
    let currentServer = useSelector(selectServer)
    let [members, setMembers] = React.useState([])
    var socket = props.socket
    function getmembers() {
        if (currentServer.server.name !== 'loading') {
            fetch(`${url.server}api/get/member`, {
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
                    setMembers(res.users)
                }
            })
        }
    }
    React.useEffect(()=>{
        socket.on("member-joined",(id,u)=>{
            console.log("hehe")
            fetch(`${url.server}api/get/member`, {
                method: "POST",
                credentials: 'include',
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': url.frontend,
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id})
            }).then(response => response.json()).then(res => {
                if (res.error === null) {
                    setMembers(res.users)
                }
            })
        })
    })
    // eslint-disable-next-line
    React.useEffect(() => {
        getmembers()
    }, [currentServer.server])
    return (
        <div className='server-members'>
            <div className='chat-header noselect'><h3>Members</h3></div>
            <div className='chat-member'>
                {members.map(member => (
                    <MemberName key={member.id} name={member.name} profile={member.profile} />
                ))}
            </div>
        </div>
    )
}
