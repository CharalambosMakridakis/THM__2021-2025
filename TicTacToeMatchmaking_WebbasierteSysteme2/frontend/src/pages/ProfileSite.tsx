import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../providers/AuthService';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import Header from '../components/Header';

const ProfileSite: React.FC = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const token = getToken();

    useEffect(()=>{
        if(!token) navigate('/login');
    }, [navigate, token]);

    function handleUsernameChange(){
        fetch('http://localhost:3000/api/update_username',{
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
            body: JSON.stringify({
                newUsername: username
            })
        });
        removeToken();
        navigate('/login');
    }

    function handlePasswordChange(){
        fetch('http://localhost:3000/api/update_password',{
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                newPassword: password
            })
        });
        removeToken();
        navigate('/login');
    }

    function handleUploadProfilePicture() {
        if (!profilePicture) return;
        const formData = new FormData();
        formData.append('image', profilePicture);
        fetch('http://localhost:3000/api/update_profile_picture', {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
            body: formData
        });
        navigate('/');
    }
    
    return (
        <Container>
            <Header current='Profile' disableProfile={false}/>
            <Container fluid style={{ width: '60%'}}>

                <p style={{ color: 'gray', fontSize: '2rem' }}>
                    Username:
                </p>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">New Username</InputGroup.Text>
                    <Form.Control
                        value={username ?? ''}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>

                <Button
                    onClick={handleUsernameChange}
                >
                    Change Username
                </Button>

                <hr style={{ border: 'solid 1px black'}} />

                <p style={{ color: 'gray', fontSize: '2rem' }}>
                    Password:
                </p>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">New Password</InputGroup.Text>
                    <Form.Control
                        value={password ?? ''}
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                
                <Button
                    onClick={handlePasswordChange}
                >
                    Change Password
                </Button>

                <hr style={{ border: 'solid 1px black'}} />

                <p style={{ color: 'gray', fontSize: '2rem' }}>
                    Profile-Picture:
                </p>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Change Profile-Picture</Form.Label>
                    <Form.Control 
                        type="file" 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                                const file = files[0];
                                setProfilePicture(file);
                            }
                        }}  
                    />
                </Form.Group>

                <Button
                    onClick={handleUploadProfilePicture}
                >
                    Change Profile-Picture
                </Button>
                
            </Container>
        </Container>
    );
};

export default ProfileSite;
