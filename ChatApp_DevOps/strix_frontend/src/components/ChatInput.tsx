import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import {Container, Form} from "react-bootstrap";
import './ChatInput.css';

interface ChatInputProps {
    addMessage: (content: string) => void;
}
const ChatInput: React.FC<ChatInputProps> = ({ addMessage }) => {
    const [message, setMessage] = useState('');

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.trim() !== '') {
            addMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="chat-input">
            <Container className="mt-10">
                <Form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Nachricht eingeben..."
                        value={message}
                        onChange={handleMessageChange}
                    />
                    <button className="btn btn-primary" type="submit">
                        Senden
                    </button>
                </Form>
            </Container>
        </div>
    );
};

export default ChatInput;
