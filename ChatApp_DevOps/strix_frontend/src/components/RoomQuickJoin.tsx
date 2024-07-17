import { useEffect, useState } from 'react';
import { useAuth } from '../provides/AuthContext';
import { useSocket } from '../provides/SocketContext';
import './RoomQuickJoin.css';
import { useRoom } from '../provides/RoomContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed } from '@fortawesome/free-solid-svg-icons';

const RoomQuickJoin = () => {
    
    const [rooms, setRooms] = useState<{name: string, id: string}[]>([]);

    const { token } = useAuth();
    const { socket }  = useSocket();
    const { setRoomInfo } = useRoom();
    
    useEffect(() => {

        const requestRoomUpdate = () => {
            socket?.emit('room_update_request', {
                token: token
            });
        }

        socket?.on('RESPONSE', (resp: { code: number, data: []}) => {
            if(resp.code === 206){
                setRooms(resp.data);
            }
        } );

        requestRoomUpdate();

        return () => {
            socket?.off('rooms_update',);
        };
    }, [socket, token]);

    return (
        <div className="RoomsList">
            <div className="RoomHeading">
                <h1><FontAwesomeIcon icon={faDoorClosed} />  Räume </h1>
            </div>
            {
                rooms.map((room, index) => {
                    return (
                        <div
                            key={index}
                            className='font-bold border-2 rounded px-1 border-white text-xl m-2 overflow-hidden cursor-pointer hover:border-2 hover:border-black'
                            onClick={() => {
                                const roomId = rooms[index].id;
                                const roomName = rooms[index].name;

                                socket?.emit('join_room', {
                                    roomId: roomId,
                                    token: token
                                });

                                setRoomInfo({
                                    id: roomId,
                                    name: roomName
                                })
                            }}
                        >
                            <p className='float-left'>{room.name}</p>
                            <p className='float-right'>🟢</p>
                        </div>)
                })
            }
        </div>
    );
};

export default RoomQuickJoin;





