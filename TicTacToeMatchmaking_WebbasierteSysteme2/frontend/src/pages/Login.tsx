import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../providers/AuthService';
import { Button, Container, Form } from 'react-bootstrap';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const responseBody: { token: string} = await response.json();
                setToken(responseBody.token);
                navigate("/");
            } else {
                const errorBody: {message: string, statusCode: number, error: string } = await response.json();
                alert(errorBody.message);
            }
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <Container className='mx-auto' style={{ width: '25rem', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '5px' }}>
            <h2 className='text-center'>Login</h2>
            <hr/>
            <Form.Label htmlFor="inputUsername">Username</Form.Label>
            <Form.Control
                type="name"
                id="inputUsername"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />

            <Form.Label htmlFor="inputPassword">Password</Form.Label>
            <Form.Control
                type="password"
                id="inputPassword"
                aria-describedby="passwordHelpBlock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Group className='mt-4'>
                <Button onClick={handleLogin}>Login</Button>
                <Link className='mx-3' to='/register'>noch kein Konto?</Link>
            </Form.Group>
        </Container>
    );
};

export default Login;
