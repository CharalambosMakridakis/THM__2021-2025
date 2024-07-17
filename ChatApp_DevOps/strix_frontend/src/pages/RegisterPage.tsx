import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSocket } from '../provides/SocketContext';
import { useAuth } from '../provides/AuthContext';
import './RegisterPage.css';
import Cookies from 'js-cookie';

const RegisterPage: React.FC<{setIsRegistered: Dispatch<SetStateAction<boolean>>}> = (
    props : {
        setIsRegistered: Dispatch<SetStateAction<boolean>>
    }
) => {

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [company_email, setCompany_email] = useState('');
  const [password, setPassword] = useState('');
  const [company_number, setCompany_number] = useState('');
  const [department, setDepartment] = useState('');

  const { socket } = useSocket();
  const { token, setToken } = useAuth();

  useEffect(() => {
    const CookieToken = Cookies.get('token');

    if (token) setToken(token);
    if(CookieToken) setToken(CookieToken);

    //listen for register response if user does not have account 
    socket?.on('RESPONSE', (data: { code: number}) => {
        if(data.code === 201){
            props.setIsRegistered(true);
        }
    });

  }, [socket, token, setToken, props])

  const handleRegister = () => {

    socket?.emit('register', {
      name: name,
      surname: surname,
      company_email: company_email,
      password: password,
      company_number: company_number,
      department: department
    })

  };

  return (
    <div className="">
    <div className="wrapper1">
        <h1> Registrierung </h1>
        <div className="input-box1">
            <input
                placeholder='Name '
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                placeholder="Nachname "
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
            />
            <input
                className=""
                placeholder="E-Mail "
                value={company_email}
                onChange={(e) => setCompany_email(e.target.value)}
            />
            <input
                className=""
                placeholder="Passwort "
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className=""
                placeholder="Telefonnummer "
                type="text"
                value={company_number}
                onChange={(e) => setCompany_number(e.target.value)}
            />
            <input
                className=""
                placeholder="Abteilung"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
            />
        </div>
        <div className="buttonDiv1">
            <button
                type="button" 
                onClick={handleRegister}
            >
                Registrieren
            </button>
            <button
                type="button"
                onClick={() => props.setIsRegistered(true)}
            >
                zum Login
            </button>
        </div>
    </div>
    </div>);
};

export default RegisterPage;