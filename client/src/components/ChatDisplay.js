import React from 'react'

export default function ChatDisplay(props) {
    let name = props.from
    let profileImage = props.profileImage
    let date = props.date
    return (
        <div className="chat">
            <img src={profileImage} alt='profile' />
            <div className="msg">
                <h4>{name} <span className="noselect">{date}</span></h4>
                <h5>{props.msg}</h5>
            </div>
        </div>
    )
}
