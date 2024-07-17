import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../providers/AuthService';
import { Button, Container } from 'react-bootstrap';
import Header from '../components/Header';

const Home: React.FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if(!token) navigate('/login');

        async function fetchIngame() {
            try {
                const queueResponse = await fetch('http://localhost:3000/match/ingame', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }});
                if (queueResponse.status === 401) {
                    navigate('/login');
                }else if(queueResponse.ok){
                    const responseBody: { ingame: boolean } = await queueResponse.json()
    
                    if(responseBody.ingame) navigate('/game/1');
                }

            } catch (error) {
                console.log(error);
            }
        }

        fetchIngame();
    }, [navigate]);

    return (
        <Container>
            <Header current='Home' disableProfile={false}/>
            <Container fluid>
                <h1>Play a Game:</h1>
                <Button
                    variant='primary'
                    style={{ fontSize: '2rem' }}
                    onClick={() => {
                        navigate('/queue');
                    }}
                >
                    Play
                </Button>
                <hr />
            </Container>
        </Container>
    );
};

export default Home;
