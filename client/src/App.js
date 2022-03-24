import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { login } from './features/userSlice'
import { useDispatch } from 'react-redux'
import './login.css'
import url from "./url.json"
import AppHome from './components/AppHome'
import Loading from "./components/Loading"
function App() {
  let [ShowApp, setShowApp] = useState(false)
  let [loginState, setLoginState] = useState(false)
  let [isLoaded, setisLoaded] = useState(false)
  let [loginOp, setLogO] = useState(true)
  var [email, setEmail] = useState('')
  var [password, setPassword] = useState('')
  var [error, setError] = useState('')
  var [eerror, seteError] = useState('')
  var [perror, setpError] = useState('')
  var [username, setUsername] = useState('')
  var [uerror, setuError] = useState('')
  const dispatch = useDispatch();
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': url.frontend,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      url: `${url.server}auth/user`,
    };
    axios(requestOptions)
      .then(res => {
        setisLoaded(true)
        if (res.data !== '') {
          dispatch(login({
            id: res.data.id,
            name: res.data.name,
            profile: res.data.profile,
            email: res.data.email,
            server: res.data.server
          }))
          setShowApp(true)
        }
      });
  }, [dispatch, loginState])
  window.addEventListener("dragover", function (e) {
    e.preventDefault();
  }, false);
  window.addEventListener("drop", function (e) {
    e.preventDefault();
  }, false);
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
  function handleValidationLogin() {
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
  function handleSubmitLogin() {
    if (handleValidationLogin()) {
      let formData = new FormData();
      formData.append('username', email)
      formData.append('password', password)
      axios({
        method: "POST",
        url: `${url.server}auth/login`,
        headers: {
          'Access-Control-Allow-Origin': url.frontend,
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include',
        withCredentials: true,
        data: urlencodeFormData(formData)
      }).then((res) => {
        if (res.data.error === null) {
          setLoginState(true)
        } else {
          setError(res.data.error)
        }
      });

    }
  }
  function handleValidationRegister() {
    let fields = { email, username, password };
    let formIsValid = true;


    if (typeof fields["username"] !== "undefined") {
      if (!fields["username"].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        setuError('invalid username');
      }
    }
    if (fields["username"] === '') {
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
  function handleSubmitRegister() {
    if (handleValidationRegister()) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': url.frontend,
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, displayName: username, password: password })
      };
      fetch(`${url.server}auth/register`, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === null) {
            setLogO(true);
          }
          else if (data.error === 'not valid') {
            setError('not valid')
          }
          else {
            setError('User already registered')
          }
        });
    }
  }
  return (
    <div className="App">
      {isLoaded ?
        <>
          {ShowApp ? <AppHome /> :
            <>
              {loginOp ?
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
                      <button className="btn login noselect" onClick={handleSubmitLogin}>Login</button>
                      <div className="btn sign-up noselect" onClick={() => setLogO(false)}>Need an account? <span>sign up</span></div>
                    </div>
                  </div>
                </>
                :
                <div className="sign-body">
                  <div className="login-container">
                    <h2 className="noselect">Create an account</h2>
                    <form className="login-form">
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
                      <h4 style={{ color: 'red', fontWeight: '500', marginBottom: '0' }}> {eerror}</h4>
                      <label className="noselect">Username</label>
                      <div className="holder">
                        <FontAwesomeIcon icon={faUser} color="grey" className="usr-icon" id="usr-icon" />
                        <input type="text" required className="login-username noselect" placeholder="Username" id="username" onChange={event => {
                          setUsername(event.target.value)
                          setuError('')
                          setError('')
                        }} />
                      </div>
                      <h4 style={{ color: 'red', fontWeight: '500', marginBottom: '0px' }}> {uerror}</h4>
                      <label className="noselect">password</label>
                      <div className="holder">
                        <FontAwesomeIcon icon={faKey} color="grey" className="pass-icon" />
                        <input type="password" required className="login-password noselect" placeholder="Password" id="password" onChange={event => {
                          setPassword(event.target.value)
                          setpError('')
                          setError('')
                        }} />
                      </div>
                      <h4 style={{ color: 'red', fontWeight: '500', marginBottom: '10px' }}> {perror}</h4>
                    </form>
                    <input type="submit" className="btn login noselect" onClick={handleSubmitRegister} value='Continue' />
                    <div className="btn sign-up noselect" onClick={() => { setLogO(true) }}>Have an account? <span>log in</span></div>
                  </div>
                </div>
              }
            </>}
        </>
        : <Loading></Loading>}
    </div>
  );
}

export default App;
