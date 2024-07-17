import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../providers/AuthService';
import { Container, Table } from 'react-bootstrap';
import Header from '../components/Header';
import StatsPanel from '../components/StatsPanel';

const Matchhistory: React.FC = () => {

    interface GameHistoryEntry {
        won: number, 
        op: string, 
        date: string, 
        elo_change: number
    }

    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState<GameHistoryEntry[]>([]);

    useEffect(()=>{
        const token = getToken();
        if(!token) navigate('/login');

        const fetchStats = async () => {
            
            try {
                const response = await fetch('http://localhost:3000/matchstats/history', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (response.status === 401) {
                    navigate('/login');
                }else if (response.ok) {
                    const responseBody: GameHistoryEntry[] = await response.json();
                    if(responseBody){
                        setHistoryData(responseBody)
                    }else{
                        console.log('Failed');
                    }
                } else {
                    console.error('Loading history failed!');
                }
            } catch (error) {
                console.error('Error during history fetch:', error);
            }
        }

        fetchStats();
    }, [navigate]);

    return (
        <Container>
            <Header current='Matchhistory' disableProfile={false}/>
            <Container className='text-center' style={{ width: '100%'}}>
                <h1>Stats:</h1>
            </Container>
            <StatsPanel />
            <Container fluid className='text-center' style={{ marginTop: '5rem'}}>
                <h1>History:</h1>
                <hr />
                <Table striped bordered className='text-center'>
                    <thead>
                        <tr>
                            <th>Result</th>
                            <th>Opponent</th>
                            <th>Elo Gain</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            historyData.map((game, index) => {
                                let backgroundColor, resultText;
                                if (game.won === 1) {
                                    backgroundColor = 'green';
                                    resultText = 'WIN';
                                } else if (game.won === 2) {
                                    backgroundColor = 'red';
                                    resultText = 'DEFEAT';
                                } else if (game.won === 0) {
                                    backgroundColor = 'orange';
                                    resultText = 'DRAW';
                                } else {
                                    backgroundColor = 'grey';
                                    resultText = 'UNKNOWN';
                                }
                                return (<tr key={index}>
                                    <td style={{ backgroundColor: backgroundColor}}>{ resultText }</td>
                                    <td style={{ backgroundColor: backgroundColor}}>{ game.op }</td>
                                    <td style={{ backgroundColor: backgroundColor}}>{ game.elo_change }</td>
                                    <td style={{ backgroundColor: backgroundColor}}>{ new Date(game.date).toLocaleString('de') }</td>
                                </tr>)
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};

export default Matchhistory;
