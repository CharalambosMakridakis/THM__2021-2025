import React from 'react';
import ChatMessage from './ChatMessage';
import '../App.css';

interface ChatHistoryProps {
    messages: { author: string; content: string }[];
}
const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {

    return (
        <div className="chat-history">
            {messages.map((message, index) => (
                <ChatMessage key={index} author={message.author} content={message.content} />
            ))}
        </div>
    );
};
export default ChatHistory;





