import { useAuth } from '../provides/AuthContext';
import { useSocket } from '../provides/SocketContext';
import { useRoom } from '../provides/RoomContext';
import './Menu.css';
import { useEditProfile } from '../provides/EditProfilContext';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt, faArrowLeft, faCogs} from '@fortawesome/free-solid-svg-icons';
import '../index.css';
import Cookies from 'js-cookie';

const Menu = () => {
    
    const { token, setToken } = useAuth();
    const { socket }  = useSocket();
    const { roomInfo, setRoomInfo } = useRoom();
    const { open, setOpen } = useEditProfile();
    
    const handleBack = () => {
        if(open){
            setOpen(false);
        }else if(roomInfo){
            socket?.emit('leave_room', {
                token: token,
                roomId: roomInfo.id
            });

            setRoomInfo(null);
        }else if(token){
            socket?.emit('disconnect_user', {
                token: token
            });
            
            Cookies.remove('token');
            setToken(null);
        }
    }

    const handleProfilClick = () => {
        setOpen(true);
    }

    return (
        <div className='nav'>
            <div className = "nav__item" onClick={handleBack}>
                <p>
                    { (token && !roomInfo && !open) ? <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                        : <FontAwesomeIcon icon={faArrowLeft} className="icon" /> }
                </p>
            </div>

            <div 
                className="nav__item" onClick={handleProfilClick}>
                <p>
                    <FontAwesomeIcon icon={faCogs} className="icon" />
                </p>
            </div>

        </div>
    );
};

export default Menu;





