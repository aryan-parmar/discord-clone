import React from 'react'
import url from '../url.json'

export default function MemberName(props) {
    let Name = props.name
    let profile = props.profile
    return (
        <div className="member">
            <img src={url.server + profile} alt={Name} />
            <h4>{Name}</h4>
        </div>
    )
}
