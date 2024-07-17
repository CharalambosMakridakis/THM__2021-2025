import React, { useEffect, useState } from 'react';
import { useSocket } from '../provides/SocketContext';
import { useAuth } from '../provides/AuthContext';
import RegisterPage from './RegisterPage';
import './LoginPage.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const LoginPage: React.FC = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(true);

  const { socket } = useSocket();
  const { token, setToken } = useAuth();

  useEffect(() => {
    const CookieToken = Cookies.get('token');

    if (token) setToken(token);
    if(CookieToken) setToken(CookieToken);

    //listen for auth response if user has account 
    socket?.on('RESPONSE', (resp: { code: number, data: { token: string }}) => {
      if(resp.code === 200){
        const token: string = resp.data.token;
        setToken(token);
        Cookies.set('token', token);
      }
    });

  }, [socket, token, setToken, isRegistered])

  const handleLogin = () => {

    socket?.emit('auth',{
      company_email: username,
      password: password,
    })
  
  };

  if(!isRegistered) return <RegisterPage setIsRegistered={setIsRegistered} />;

  return (
     <div className="wrapper">
        <h1 >  Login </h1>
        <div className="input-box">
            <input
              placeholder='Email ...'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              id="pw"
              placeholder="Password ..."
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <div className="buttonDiv">
          <button
            className="btn"
            type="button"
            onClick={handleLogin}
           >
            Login
          </button>
          <button
            className= "btn2"
            type="button"
            onClick={() => setIsRegistered(false)}
          >
            zum Registrieren
          </button>
        </div>
     </div>
  );
};

export default LoginPage;