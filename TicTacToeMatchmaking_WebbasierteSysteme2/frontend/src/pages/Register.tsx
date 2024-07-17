import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const responseBody: { success: boolean, message: string } = await response.json();
                if(responseBody.success){
                    navigate("/login");
                }else{
                    alert(responseBody.message);
                    setUsername('');
                    setPassword('');
                }
            } else {
                const errorBody: { message: string, statusCode: number, error: string } = await response.json();
                alert(errorBody.message);
            }
            
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <Container className='mx-auto' style={{ width: '25rem', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '5px' }}>
            <h2 className='text-center'>Register</h2>
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
            <Form.Text id="passwordHelpBlock" muted>
                Your password must be 8-20 characters long, contain letters and numbers,
                and must not contain spaces, special characters, or emoji.
            </Form.Text>
            <Form.Group className='mt-2'>
                <Button onClick={handleRegister}>Register</Button>
                <Link className='mx-3' to='/login'>bereits ein Konto?</Link>
            </Form.Group>
        </Container>
    );
};

export default Register;
