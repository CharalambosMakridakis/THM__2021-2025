import { useEffect, useState } from 'react';
import { useAuth } from '../provides/AuthContext';
import { useSocket } from '../provides/SocketContext';
import './OnlineStatus.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import StatusDropDown from './StatusDropDown';

const OnlineStatusBar = () => {

    const [statusArray, setStatusArray] = useState<{
        company_email: string, 
        company_number: string, 
        department: string, 
        name: string, 
        surname: string
        status: string }[] | null>(null);
   
    const { token } = useAuth();
    const { socket }  = useSocket();
    
    useEffect(() => {
        socket?.on('RESPONSE', (resp: { code: number, data: [] }) => {
            if(resp.code === 210){
                setStatusArray(resp.data);
            }
        });

        socket?.emit('status_info', {
            token: token
        });
    }, [socket, token]);

    return (
        <div >
            <div className="statusHeading">
                <h1 > <FontAwesomeIcon icon={faCheckCircle} /> Status </h1>
            </div>

            <div className='w-[90%] mt-2 mb-4 mx-auto'>
                <StatusDropDown />
            </div>
            {
                statusArray?.map((status, index) => (
                        <div className='flex flex-col border-2 text-white border-white px-1 rounded-xl m-1' key={index}>
                            <p className='font-bold w-full text-center' key={'name' + index}>
                                { status.name + ' ' + status.surname }
                            </p>
                            <div className='w-[90%] mx-auto border-t-2 border-white' key={'row' + index} />
                            <p className='font-bold' key={'depart' + index}>
                                {'🏚 ' + status.department }
                            </p>
                            <p className='font-bold' key={'phone' + index}>
                                {'📞 ' + status.company_number }
                            </p>
                            <p className='font-bold' key={'status' + index}>
                                { status.status === 'verfügbar' ? 
                                    <p className='text-green-600' key={'green'+ status.status + index}>verfügbar</p> 
                                    : 
                                    <p className='text-red-500' key={'red' + status.status + index}>{status.status}</p> 
                                    }
                            </p>
                        </div>
                    )
                )
            }
        </div>
    );
};

export default OnlineStatusBar;





