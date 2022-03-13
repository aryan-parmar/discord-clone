import React from 'react'
import url from '../url.json'

export default function ChatDisplay(props) {
    let name = props.from
    let profileImage = props.profileImage
    let date = props.date
    let previous = props.lastmessage.id
    let previousDate = props.lastmessage.date
    previousDate = new Date(previousDate).toLocaleDateString()
    let current = props.current
    let a = 1
    if (previous === current && previousDate === new Date(date).toLocaleDateString()) a = 0;
    return (
        <div className={a ? "chat start" : "chat"}>
            {a ?
                <img src={url.server + profileImage} alt='profile' />
                : <div className='spacer'></div>}
            <div className="msg">
                {a ?
                    <h4>{name} <span className="noselect">{new Date(date).toLocaleDateString()}</span></h4>
                    :
                    <></>
                }
                <h5>{props.msg}</h5>
            </div>
        </div>
    )
}
