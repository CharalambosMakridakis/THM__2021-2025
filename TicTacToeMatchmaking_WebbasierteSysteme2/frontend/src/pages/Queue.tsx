import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../providers/AuthService';
import { useSocket } from '../providers/useSocket';
import { Button, Container, Row, Spinner, Card } from 'react-bootstrap';
import Header from '../components/Header';


const Queue: React.FC = () => {

    const [inQueue, setInQueue] = useState(false);

    const navigate = useNavigate();
    const { socket } = useSocket();
    const token = getToken();

    if(!token || !socket) navigate('/login');

    useEffect(() => {
        socket?.on('GAME', (data) => {
            const gameId: string = data.gid;
            navigate(`/game/${gameId}`);
        });
    }, [token, socket, navigate]);

    function queueForGame(){
        socket?.emit('queue');
        setInQueue(true);
    }

    function deQueueForGame(){
        socket?.emit('dequeue');
        setInQueue(false);
    }

    return (
        <Container>
            <Header current='Queue' disableProfile={false}/>
            <h1>Games:</h1>
            <hr/>
            <Row>
                <Card className="mx-2 mb-3" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/tictactoe.jpg" />
                    <Card.Body>
                        <Card.Title>TicTacToe</Card.Title>
                        <Card.Text>
                            Tic-tac-toe is a two-player game where players take turns marking spaces in a 3x3 grid, 
                            aiming to get three in a row, column, or diagonal to win.
                        </Card.Text>
                        {
                            inQueue ? (
                                <>
                                    <Button
                                        onClick={deQueueForGame}
                                        variant='outline-dark'
                                    >
                                        cancel Queue
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            style={{ marginRight: '5px', marginLeft: '5px', marginTop: '1px' }} 
                                        />
                                    </Button>
                                </>
                            ):(
                                <Button 
                                    onClick={queueForGame}
                                    variant='primary'
                                >
                                    Queue
                                </Button>
                            )
                        }   
                    </Card.Body>
                </Card>

                <Card className="mx-2 mb-3" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/coming_soon.jpg" style={{ filter: 'blur(2px)' }} />
                    <Card.Body>
                        <Card.Title>Coming Soon</Card.Title>
                        <Card.Text>
                            There will be many more games in the future. (not really)
                        </Card.Text>
                            <Button
                                disabled
                                variant='outline-dark'
                            >
                                preorder
                            </Button>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Queue;
