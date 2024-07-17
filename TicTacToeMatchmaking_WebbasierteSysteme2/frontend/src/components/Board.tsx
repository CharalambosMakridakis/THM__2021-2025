import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

interface BoardProps {
    board: number[][]
    makeMove: (x: number, y:number)=>void
}

const Board: React.FC<BoardProps> = ({ board, makeMove }) => {
    
    return (
        <Container style={{width: "fit-content", height: "90rem", margin: "0px", padding: "0px"}}>
            {board.map((row: number[], rowIndex: number) => (
                <Row key={rowIndex} style={{margin: "0px", padding: "0px", width: "fit-content"}}>
                    {row.map((cell: number, colIndex: number) => (
                        <Col key={colIndex} xs={4} style={{margin: "0px", padding: "0px"}}>
                            <Button
                                className='border border-dark'
                                variant="light"
                                style={{ width: "calc(150px - 4px)", height: "150px", fontSize: "3rem", margin:"2px", borderRadius: "0%" }}
                                onClick={()=>{
                                    makeMove(rowIndex, colIndex);
                                }}
                                >
                                { cell === 1 ? "X" : cell === 2 ? "O" : "" }
                            </Button>
                        </Col>
                    ))}
                </Row>
            ))}
        </Container>
    );
};

export default Board;