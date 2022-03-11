import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import url from "../url.json"

export default function Register() {
    var [email, setEmail] = useState('')
    var [username, setUsername] = useState('')
    var [password, setPassword] = useState('')
    var [error, setError] = useState('')
    var [eerror, seteError] = useState('')
    var [uerror, setuError] = useState('')
    var [perror, setpError] = useState('')

    function handleValidation() {
        let fields = { email, username, password };
        let formIsValid = true;

        
        if (typeof fields["username"] !== "undefined") {
            if (!fields["username"].match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                setuError('invalid username');
            }
        }
        if (fields["username"]==='') {
            formIsValid = false;
            setuError('username cannot be empty')
        }
        
        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');
            
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                seteError('Invalid email')
            }
        }
        if (fields["email"]==="") {
            formIsValid = false;
            seteError('Enter a valid email');
        }
        if (fields['password'].length < 8) {
            formIsValid = false;
            setpError('Password must be at least 8 characters')
        }
        return formIsValid;
    }

    function handleSubmit() {

        if (handleValidation()) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': url.frontend,
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, displayName: username, firstName: username, password: password })
            };
            fetch(`${url.server}api/register/user`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.error === null) {
                        window.location.href = '/'
                    }
                    else if(data.error === 'not valid') {
                        setError('not valid')
                    }
                    else{
                        setError('User already registered')
                    }
                });
        }
    }
    return (
        <div className="sign-body">
            <div className="login-container">
                <h2 className="noselect">Create an account</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <h4 style={{ color: 'red', fontWeight: '500' }}> {error}</h4>
                    <label className="noselect">Email</label>
                    <div className="holder">
                        <FontAwesomeIcon icon={faEnvelopeOpenText} color="grey" className="pass-icon" />
                        <input type="email" required className="login-email noselect" placeholder="Email" id="Email" onChange={event => {
                            setEmail(event.target.value);
                            setError('')
                            seteError('')
                        }} />
                    </div>
                        <h4 style={{ color: 'red', fontWeight: '500', marginBottom:'0'  }}> {eerror}</h4>
                    <label className="noselect">Username</label>
                    <div className="holder">
                        <FontAwesomeIcon icon={faUser} color="grey" className="usr-icon" id="usr-icon" />
                        <input type="text" required className="login-username noselect" placeholder="Username" id="username" onChange={event => {
                            setUsername(event.target.value)
                            setuError('')
                            setError('')
                        }} />
                    </div>
                        <h4 style={{ color: 'red', fontWeight: '500', marginBottom:'0px'  }}> {uerror}</h4>
                    <label className="noselect">password</label>
                    <div className="holder">
                        <FontAwesomeIcon icon={faKey} color="grey" className="pass-icon" />
                        <input type="password" required className="login-password noselect" placeholder="Password" id="password" onChange={event => {
                            setPassword(event.target.value)
                            setpError('')
                            setError('')
                            }} />
                    </div>
                        <h4 style={{ color: 'red', fontWeight: '500', marginBottom:'10px' }}> {perror}</h4>
                </form>

                <input type="submit" className="btn login noselect" onClick={handleSubmit} value='Continue' />
                <a href="/" className="btn sign-up noselect">Have an account? <span>log in</span></a>
                <h4 className="noselect">Or</h4>
                <a href="http://localhost:3000/auth/google" className="btn btn-google noselect"><FontAwesomeIcon icon={faGoogle} /><h4>Continue with Google</h4></a>
            </div>
        </div>
    )
}
