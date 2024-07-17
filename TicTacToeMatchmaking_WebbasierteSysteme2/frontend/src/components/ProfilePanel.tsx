import React, { useEffect, useState } from 'react';
import { getToken } from '../providers/AuthService';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import ProfileImage from './ProfileImage';

interface UserInterface {
    id: number,
    username: string,
    isAdmin: boolean,
    elo: number
}

const ProfilePanel: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserInterface | null>(null);

    useEffect(()=>{
        const token = getToken();
        if(!token) navigate('/login');

        const fetchProfile = async () => {
            
            try {
                const response = await fetch('http://localhost:3000/api/get_profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (response.status === 401) {
                    navigate('/login');
                }else if (response.ok) {
                    const responseBody: UserInterface = await response.json();
                    if(responseBody){
                        setUserData(responseBody)
                    }else{
                        console.log('Failed');
                    }
                } else {
                    console.error('Loading user failed!');
                }
            } catch (error) {
                console.error('Error during user fetch:', error);
            }
        }

        fetchProfile();
    }, [navigate]);

    return (
        <Container className='text-center fw-bold'>
            <Row>
                <Col>
                    <p style={{ textDecoration: 'underline' }}>{ userData?.username }</p>
                    <p>{"Elo: " + userData?.elo}</p>
                </Col>
                <Col style={{ padding: '0px'}}>
                    <ProfileImage />
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePanel;
