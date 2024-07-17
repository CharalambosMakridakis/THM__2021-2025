import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';
import { useAuth } from '../provides/AuthContext';
import { useRoom } from '../provides/RoomContext';


const StateChanger = () => {

    const { token } = useAuth();
    const { roomInfo } = useRoom();

    if(roomInfo) return <ChatPage />;
    if(token) return <HomePage />;
    return <LoginPage />;
};

export default StateChanger;





