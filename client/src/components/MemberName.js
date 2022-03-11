import React from 'react'

export default function MemberName(props) {
    let Name = props.name
    let profile = props.profile
    return (
        <div className="member">
            <img src={profile} alt={Name} />
            <h4>{Name}</h4>
        </div>
    )
}
