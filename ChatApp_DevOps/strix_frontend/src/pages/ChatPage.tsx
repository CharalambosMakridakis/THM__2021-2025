import { useEffect, useState } from 'react';
import { useAuth } from '../provides/AuthContext';
import { useSocket } from '../provides/SocketContext';
import { useRoom } from '../provides/RoomContext';
import { useEditProfile } from '../provides/EditProfilContext';
import {lock, isLocked} from '../provides/MessageLock';
import Menu from '../components/Menu';
import ProfileEditPage from './ProfileEditPage';
import './HomePage.css';
import './ChatPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatPage = () => {
    const [messages, setMessages] = useState<{ author: string; content: string, incoming: boolean}[]>([]);
    const [input, setInput] = useState<string>('');
    
    const { token } = useAuth();
    const { socket }  = useSocket();
    const { roomInfo } = useRoom();
    const { open } = useEditProfile();

    const handleNewMessage = (resp: { code: number, data: any}) => {
        if(resp.code === 208 && !isLocked()){
            lock();
            setMessages((prevMessages) => [...prevMessages, { author: resp.data.from, content: resp.data.message, incoming: resp.data.self }]);
        }
    };

    useEffect(() => {
        socket?.on('RESPONSE', handleNewMessage);

        return () => {
            socket?.off('RESPONSE', handleNewMessage);
        };
    }, [socket]);

    const sendMessage = (content: string) => {
        if (content.trim() !== '') {
            socket?.emit('message_to_room', {
                message: content,
                token: token,
                roomId: roomInfo?.id
            });
            setInput('');
        }
    };

    if(open) return <ProfileEditPage />;

    return (
        <div className='flex flex-row w-[1000px] mx-auto globalDev'>
            <div className='div1'>
                <Menu />
            </div>

            <div className="flex flex-col gap-4 items-center flex-grow ml-8 mr-4 my-3 rounded-xl p-4 test">
                <div className='bg-[#404040] w-[90%] p-2 mx-auto text-center rounded-xl'>
                    <h1 className='text-red text-white text-2xl font-bold text-center'>
                        {roomInfo?.name}
                    </h1>
                </div>

                <div className='flex-grow w-[700px] mx-auto min-h-[500px] bg-gray-400 rounded-lg shadow-inner tt'>
                    <div className='w-full grid grid-cols-1 test1'>
                        {
                            messages.map((message, index) => {
                            
                                if(!message.incoming){
                                    return(
                                        <div className='w-full grid grid-cols-2 gap-2' key={index}>
                                            <div className='bg-red-200 border-2 border-red-300 m-2 rounded-bl-2xl rounded-r-2xl p-2'>
                                                <p className='text-sm font-thin text-gray-500'>{ message.author }</p>
                                                {message.content}
                                            </div>
                                            <div></div>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div className='w-full grid grid-cols-2' key={index}>
                                            <div></div>
                                            <div className='bg-green-200 border-2 border-green-300 border-red m-2 rounded-br-2xl rounded-l-2xl p-2'>
                                                <p className='text-sm font-thin text-gray-500'>{ message.author }</p>
                                                {message.content}
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                
                <div className='flex gap-2 flex-row w-[90%] mx-autos mb-2 nachricht '>
                    <input
                        type="text"
                        placeholder="Nachricht ..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                        className='border-2 flex-grow  border-green-700 text-white bg-green-700 p-2 rounded-md'
                        onClick={() => {sendMessage(input)}}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;





