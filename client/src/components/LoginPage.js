import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import { selectUser, login } from '../store/userSlice'
import { useSelector, useDispatch} from 'react-redux'


import '../login.css'

export default function LoginPage(props) {
    const user = useSelector(selectUser)
    const dispatch = useDispatch();
    var [email, setEmail] = useState('')
    var [password, setPassword] = useState('')
    var [error, setError] = useState('')
    var [eerror, seteError] = useState('')
    var [perror, setpError] = useState('')

    function urlencodeFormData(fd) {
        var s = '';
        function encode(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
        for (var pair of fd.entries()) {
            if (typeof pair[1] == 'string') {
                s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
            }
        }
        return s;
    }

    function handleValidation() {
        let fields = { email, password };
        let formIsValid = true;
        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                seteError('invalid email');
            }
        }
        if (fields["email"] === "") {
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
            let formData = new FormData();
            formData.append('username', email)
            formData.append('password', password)
            axios({
                method: "POST",
                url: "http://localhost:3000/login",
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3001/',
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include',
                withCredentials: true,
                data: urlencodeFormData(formData)
            }).then((res) => {
                if (res.data.error === null) {
                    dispatch(login({
                        id: res.data.id,
                        name: res.data.name,
                        server: res.data.server,
                        profile: res.data.profile,
                        email: res.data.email
                    }))
                } else {
                    setError(res.data.error)
                }
            });

        }
    }
    return (
        <>
        <div className="login-body">
            <div className="login-container">
                <h2 className="noselect">Welcome Back!</h2>
                <h5 className="noselect">We're so excited to see you again!</h5>
                <form className="login-form">
                    <h4 style={{ color: 'red', fontWeight: '500' }}> {error}</h4>
                    <label className="noselect">Email</label>
                    <div className="holder">
                        <FontAwesomeIcon icon={faUser} color="grey" className="usr-icon" id="usr-icon" />
                        <input type="email" required className="login-username noselect" placeholder="Email" id="email" name="username" onChange={event => {
                            setEmail(event.target.value);
                            setError('')
                            seteError('')
                        }} />
                    </div>
                    <h4 style={{ color: 'red', fontWeight: '500', marginBottom: '0' }}> {eerror}</h4>
                    <label className="noselect">password</label>
                    <div className="holder">
                        <FontAwesomeIcon icon={faKey} color="grey" className="pass-icon" />
                        <input type="password" required className="login-password noselect" placeholder="Password" id="password" name="password" onChange={event => {
                            setPassword(event.target.value)
                            setpError('')
                            setError('')
                        }} />
                    </div>
                    <h4 style={{ color: 'red', fontWeight: '500', marginBottom: '10px' }}> {perror}</h4>
                    <a href="/forgot-password" className="btn forgot noselect">Forgot Password ?</a>

                </form>
                <button className="btn login noselect" onClick={handleSubmit}>Login</button>
                <a href="/register" className="btn sign-up noselect">Need an account? <span>sign up</span></a>
                <h4 className="noselect">Or</h4>
                <a href="http://localhost:3000/auth/google" className="btn btn-google noselect"><FontAwesomeIcon icon={faGoogle} /><h4>Continue with Google</h4></a>
            </div>
        </div>
        </>
    )
}
