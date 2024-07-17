import React from 'react';
import '../App.css';
interface ChatMessageProps {
    author: string;
    content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ author, content }) => {
    return (
        <div className="chat-message">
            <strong>{author}:</strong> {content}
        </div>
    );
};

export default ChatMessage;