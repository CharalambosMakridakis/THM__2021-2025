import { useEffect, useState } from 'react';
import { useAuth } from '../provides/AuthContext';
import { useSocket } from '../provides/SocketContext';
import { useEditProfile } from '../provides/EditProfilContext';
import { useRoom } from '../provides/RoomContext';
import RoomQuickJoin from '../components/RoomQuickJoin';
import Menu from '../components/Menu';
import ProfileEditPage from './ProfileEditPage';
import OnlineStatusBar from '../components/OnlineStatus';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {

    const [roomName, setRoomName] = useState<string>('');

    const [rooms, setRooms] = useState<{name: string, id: string}[]>([]);
    
    const { token } = useAuth();
    const { socket }  = useSocket();
    const { open } = useEditProfile();
    const { setRoomInfo } = useRoom()

    const handleCreateClicked = () => {
        const newRoomName = roomName.trim();

        socket?.emit('room', {
            name: newRoomName,
            token: token
        });

        requestRoomUpdate();
    }

    const handleJoinClicked = () => {
        for(const room of rooms){
            if(room.name === roomName.trim()){
                socket?.emit('join_room', {
                    roomId: room.id,
                    token: token
                });

                setRoomInfo({
                    id: room.id,
                    name: roomName
                })
                return;
            }
        }
    }

    const requestRoomUpdate = () => {
        socket?.emit('room_update_request', {
            token: token
        });
    }

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
            socket?.off('new_message',);
        };
    }, [socket, token]);


    if(open) return <ProfileEditPage />;
    
    return (
        <div className="flex flex-row h-[600px] mx-auto globalDev" >
            <div className="div1" >
                <Menu />
            </div>
            <div className="roomQ">
                <RoomQuickJoin />
            </div>
            <div className="div2">
                <div className="content__header">
                    <h1>
                        <FontAwesomeIcon icon={faHome}/> Home
                    </h1>
                </div>

                <div className="div4">
                    <div className="InputButton">
                        <input
                            type="text"
                            placeholder="Name des Raums ..."
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                        <button className="btn"
                            onClick={handleJoinClicked}
                        >
                            Raum beitreten
                        </button>

                    </div>
                    <div className="divbtn">
                        <button className="btn1"
                            onClick={handleCreateClicked}
                        >
                            Raum erstellen
                        </button>
                    </div>

                </div>
            </div>

            <div className="div5">
                <OnlineStatusBar />
            </div>

        </div>);
};

export default HomePage;





