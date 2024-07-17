import React, { useEffect, useState } from 'react';
import { getToken } from '../providers/AuthService';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import OpponentImage from './OpponentImage';

const OpponentPanel: React.FC = () => {

    const navigate = useNavigate();
    const [opponentData, setOpponentData] = useState<{opponent_elo: number, opponent_username: string} | null>(null);

    useEffect(()=>{
        const token = getToken();
        if(!token) navigate('/login');

        const fetchData = async () => {
            const response = await fetch('http://localhost:3000/match/opponent_info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            
            if (response.status === 401) {
                navigate('/login');
            }

            const responseBody: { opponent_elo: number, opponent_username: string } = await response.json();
            setOpponentData(responseBody);
        };

        fetchData();
    }, [navigate]);

    return (
       <Container className='text-center fw-bold'>
            <Row>
                <Col>
                    <p style={{ textDecoration: 'underline' }}>{opponentData?.opponent_username}</p>
                    <p>{"Elo: " + opponentData?.opponent_elo}</p>
                </Col>
                <Col style={{ padding: '0px'}}>
                    <OpponentImage />
                </Col>
            </Row>
       </Container>
    );
};

export default OpponentPanel;