import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import url from '../url.json'

export default function ChatDisplay(props) {
    let name = props.from
    let profileImage = props.profileImage
    let date = props.date
    let previous = props.lastmessage.id
    let previousDate = props.lastmessage.date
    let type = props.type
    let filedata = props.filedata
    var fileExt = filedata ? filedata.name.split('.').pop() : ''
    const acceptable = ["jpg", "jpeg", "png", "gif", "ico", "bmp", "apng"]
    let displayable = acceptable.includes(fileExt.toLowerCase())
    previousDate = new Date(previousDate).toLocaleDateString()
    let current = props.current
    let a = 1
    if (previous === current) a = 0;
    return (
        <div className={a ? "chat start" : "chat"}>
            {a ?
                <img src={url.server + profileImage} alt='profile' className='profile' />
                :
                <div className='spacer'></div>
            }
            <div className="msg">
                {a ?
                    <h4>{name} <span className="noselect">{new Date(date).toLocaleDateString()}</span></h4>
                    :
                    <></>
                }
                <h5>{props.msg}</h5>
                {type === "file" ?
                    <>
                        {
                            displayable ?
                                <a href={url.server + filedata.src} download={url.server + filedata.src} className='file-chat-preview'>
                                    <img src={url.server + filedata.src} alt='file' />
                                </a>
                                :
                                <div className='file-attachment'>
                                    <FontAwesomeIcon icon={faFile} style={{ margin: '0 2%', fontSize: "1.6rem", color: "rgb(150, 150, 150)", pointerEvents: "none" }} />
                                    <div className='filedata'>
                                        <a href={url.server + filedata.src} target="_blank">{filedata.name}</a>
                                        <h6>{(filedata.size / 1000000).toFixed(2)}mb</h6>
                                    </div>

                                </div>
                        }
                    </>
                    :
                    <></>
                }
            </div>
        </div>
    )
}
