import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../providers/AuthService';
import { useSocket } from '../providers/useSocket';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import Header from '../components/Header';
import Board from '../components/Board';
import OpponentPanel from '../components/OpponentPanel';
import ProfilePanel from '../components/ProfilePanel';

const Game: React.FC = () => {

    const navigate = useNavigate();
    const token = getToken();
    const { id } = useParams();
    const { socket } = useSocket();

    if(!token) navigate('/login');

    const [gameData, setGameData] = useState({
        board: [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ],
        turn: false,
    });
    const [gameMessage, setGameMessage] = useState<null | string>(null);

    useEffect(() => {

        socket?.on('board_update', (data) => {

            setGameData({
                board: convertTo2DArray(data.board),
                turn: data.turn,
            });
        });
        
        socket?.on('game_update', (data) => {
            console.log(data);
            
            if(data.state){
                switch (data.state) {
                    case "DRAW":
                        setGameMessage(data.state);
                        break;
                    
                    case "YOU WON":
                        setGameMessage(data.state);
                        break;
                    
                    case "YOU LOST":
                        setGameMessage(data.state);
                        break;
                    default:
                        break;
                }
            }

            setGameData((old) => ({
                board: convertTo2DArray(data.board),
                turn: !old.turn 
            }));

        });

        socket?.emit('board');

    },[token, socket, id]);

    function makeMove(x: number, y:number){
        socket?.emit('move',{
            index: (x * 3) + y,
        });
    }

    function convertTo2DArray(oneDArray: number[]) {
        const twoDArray = [];
    
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(oneDArray[i * 3 + j]);
            }
            twoDArray.push(row);
        }
    
        return twoDArray;
    }
    
    return (
        <Container>
            <Header current='Game' disableProfile={true} />
            <Modal show={!!gameMessage} onHide={() => navigate('/')}>
                <Modal.Header closeButton>
                <Modal.Title className='fw-bold'>{gameMessage}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Button className='m-auto fw-bold' variant="primary" onClick={() => navigate('/queue')}>
                    Play Again
                </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Col>
                    <Board board={gameData.board} makeMove={makeMove}/>
                </Col>
                <Col>
                    <h1 className='rounded m-auto' style={{ color: 'white', padding:'5px', width: 'fit-content', background: gameData.turn ? 'green' : 'red' }}>
                        { gameData.turn ? "Your Turn" : "Enemy Turn" }
                    </h1>
                    <Container style={{ width: '40%'}} className='rounded bg-primary mt-5 text-white p-1 pt-2'>
                        <ProfilePanel />
                    </Container>
                    <h1 className='text-center'>VS.</h1>
                    <Container style={{ width: '40%'}} className='rounded bg-primary text-white p-1 pt-2'> 
                        <OpponentPanel />
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Game;
