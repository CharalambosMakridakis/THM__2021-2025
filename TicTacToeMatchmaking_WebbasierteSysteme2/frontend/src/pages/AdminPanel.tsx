import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../providers/AuthService';
import { CardBody, Container, Table } from 'react-bootstrap';
import { PieChart } from '@mui/x-charts/PieChart';
import Header from '../components/Header';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';

const AdminPanel: React.FC = () => {

    const navigate = useNavigate();
    const token = getToken();
    const [queueData, setQueueData] = useState<{id: string, username: string, isAdmin: boolean, elo: number}[]>([]);
    const [gameData, setGameData] = useState<{id: string, username_1: string, username_2: string, gameStart: Date}[]>([]);
    const [allUsers, setAllUsers] = useState<{id: string, username: string, isAdmin: boolean, elo: number}[]>([]);
    const [playerStats, setPlayerStats] = useState<{playerId: number, wins: number, losses: number, draws: number}>();
    const [playerHistory, setPlayerHistory] = useState<{won: number, op: string, date: string, elo_change: number}[]>();
    const [selectedUserID, setSelectedUserID] = useState<string | null>(null);

    useEffect(()=>{
        const token = getToken();
        if(!token) navigate('/login');

        const fetchAdmin = async () => {
            try{
                const allPlayersResponse = await fetch('http://localhost:3000/admin/getAllPlayers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (allPlayersResponse.status === 401) {
                    navigate('/login');
                }
                const allPlayersJson = await allPlayersResponse.json();

                const queueResponse = await fetch('http://localhost:3000/admin/getQueue', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (queueResponse.status === 401) {
                    navigate('/login');
                }
                const queueJson = await queueResponse.json();

                const gamesReponse = await fetch('http://localhost:3000/admin/getGames', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (gamesReponse.status === 401) {
                    navigate('/login');
                }
                const gamesJson = await gamesReponse.json();

                setAllUsers(allPlayersJson.players);
                setQueueData(queueJson.queue);
                setGameData(gamesJson);
            } catch(error) {
                console.log(error);
            }
        }

        fetchAdmin();
    }, [navigate]);

    const fetchStats = async (id: string) => {
        try {
            const statsResponse = await fetch(`http://localhost:3000/admin/${id}/stats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const statsJson = await statsResponse.json();
            setPlayerStats(statsJson.stats);

            const historyResponse = await fetch(`http://localhost:3000/admin/${id}/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const historyJson = await historyResponse.json();
            setPlayerHistory(historyJson);
            setSelectedUserID(id);

        } catch (error) {
            console.log("fetch failed");
        }
    }

    if (!allUsers) return (
        <Container>
            <Header current='Admin-Panel' disableProfile={false}></Header>
            <h1>YOU ARE NOT AN ADMIN</h1>
        </Container>
    )
    return (
        <Container>
            <Header current='Admin-Panel' disableProfile={false}/>
            <Container fluid>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Registrierte Spieler</Accordion.Header>
                            <Accordion.Body>
                                {allUsers.map((user, i) =>
                                    <Card key={i}>
                                        <CardBody key={++i} onClick={() => fetchStats(user.id)}>
                                            <Table striped hover responsive borderless style={{width:"100%", tableLayout:"fixed", cursor: "pointer"}}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{textAlign:"center"}}><Badge bg="dark">{user.id}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="success">{user.username}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="danger">{user.elo}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="secondary">{user.isAdmin + ""}</Badge></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                        {
                                            playerStats && selectedUserID === user.id  ? 
                                                <CardBody>
                                                    <PieChart
                                                        colors={['red', 'orange', 'green']}
                                                        series={[
                                                            {
                                                                data: [
                                                                    { id: 0, value: playerStats.wins, color: 'green', label: 'Wins'},
                                                                    { id: 1, value: playerStats.draws, color: 'orange', label: 'Draws' },
                                                                    { id: 2, value: playerStats.losses, color: 'red', label: 'Losses'},
                                                                ],
                                                            },
                                                        ]}
                                                        width={300}
                                                        height={200}
                                                    />
                                                </CardBody> 
                                            : 
                                                "" 
                                        }
                                        {
                                            playerHistory && selectedUserID === user.id  ? (
                                                <CardBody>
                                                    <h4>History</h4>
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
                                                                playerHistory.map((entry, index) => {
                                                                let backgroundColor, resultText;
                                                                if (entry.won === 1) {
                                                                    backgroundColor = 'green';
                                                                    resultText = 'WIN';
                                                                } else if (entry.won === 2) {
                                                                    backgroundColor = 'red';
                                                                    resultText = 'DEFEAT';
                                                                } else if (entry.won === 0) {
                                                                    backgroundColor = 'orange';
                                                                    resultText = 'DRAW';
                                                                } else {
                                                                    backgroundColor = 'grey';
                                                                    resultText = 'UNKNOWN';
                                                                }
                                                                return (<tr key={index}>
                                                                    <td style={{ backgroundColor: backgroundColor}}>{ resultText }</td>
                                                                    <td style={{ backgroundColor: backgroundColor}}>{ entry.op }</td>
                                                                    <td style={{ backgroundColor: backgroundColor}}>{ entry.elo_change }</td>
                                                                    <td style={{ backgroundColor: backgroundColor}}>{ new Date(entry.date).toLocaleString('de') }</td>
                                                                </tr>)
                                                            })
                                                            }
                                                        </tbody>    
                                                    </Table>                                                
                                                </CardBody>
                                            )
                                            : 
                                                "" 
                                        }
                                    </Card>
                                )}
                            </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Spieler in der Queue</Accordion.Header>
                            <Accordion.Body>
                                {queueData.map((user, i) =>
                                    <Card key={i}>
                                        <CardBody key={++i}>
                                        <Table striped hover responsive borderless style={{width:"100%", tableLayout:"fixed"}}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{textAlign:"center"}}><Badge bg="dark">{user.id}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="success">{user.username}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="danger">{user.elo}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="secondary">{user.isAdmin + ""}</Badge></td>
                                                    </tr>
                                                </tbody>
                                        </Table>
                                        </CardBody>
                                    </Card>
                                )}
                            </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Laufende Spiele</Accordion.Header>
                            <Accordion.Body>
                                {gameData.map((game, i) =>
                                    <Card key={i}>
                                        <CardBody key={++i}>
                                        <Table striped hover responsive borderless style={{width:"100%", tableLayout:"fixed"}}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{textAlign:"center"}}><Badge bg="dark">{game.id}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="success">{game.username_1}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="primary">vs</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="danger">{game.username_2}</Badge></td>
                                                        <td style={{textAlign:"center"}}><Badge bg="secondary">{new Date(game.gameStart).toLocaleTimeString()}</Badge></td>
                                                    </tr>
                                                </tbody>
                                        </Table>
                                        </CardBody>
                                    </Card>
                                )}
                            </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </Container>
    );
};

export default AdminPanel;
