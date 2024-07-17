import { useEffect, useState } from 'react';
import { useAuth } from '../provides/AuthContext';
import { useSocket } from '../provides/SocketContext';
import { useEditProfile } from '../provides/EditProfilContext';
import RoomQuickJoin from '../components/RoomQuickJoin';
import Menu from '../components/Menu';
import './ProfilEditPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import Cookies from 'js-cookie';

const ProfileEditPage = () => {
    const [name, setName] = useState<string | undefined>();
    const [surname, setSurname] = useState<string | undefined>();
    const [company_email, setCompany_email] = useState<string | undefined>();
    const [company_number, setCompany_number] = useState<string | undefined>();
    const [department, setDepartment] = useState<string | undefined>();

    const [newPassword, setNewPassword] = useState<string | undefined>();
    
    const { token, setToken } = useAuth();
    const { socket }  = useSocket();
    const { setOpen } = useEditProfile();

    useEffect(() => {
        socket?.on('RESPONSE', (resp : { code: number, data: any}) => {
            if(resp.code === 212) {
                setName(resp.data.name);
                setSurname(resp.data.surname);
                setCompany_email(resp.data.company_email);
                setCompany_number(resp.data.company_number);
                setDepartment(resp.data.department);
            }else if(resp.code === 204) {
                //erfolgreich geändert
            }
        });

        socket?.emit('userinfo', {
            token: token
        });
        
    }, [token, socket, setOpen]);

    const handleProfileSave = () => {

        socket?.emit('update_profile', {
            company_email: company_email,
            company_number: company_number,
            department: department,
            token: token
        });

        setOpen(false);
    }

    const handlePwSave = () => {

        socket?.emit('update_password', {
            password: newPassword,
            token: token
        });
        
        Cookies.remove('token');
        setToken(null);
        setOpen(false);
    }

    return (
        <div className="flex flex-row w-[1500px] h-[700px] mx-auto globalDev">
            <div className='div1'>
                <Menu />
            </div>
            <div className="roomQ">
                <RoomQuickJoin />
            </div>

            <div className="divglobal">
                <div className="content__header">
                    <h1>
                        <FontAwesomeIcon icon={faEdit} /> Profil-Editor
                    </h1>
                </div>

                <div className="grp1">
                    <div className="grp1_1">

                        <div className='titel'>
                            <h1> Nutzerdaten ändern </h1>
                        </div>

                        <div className='flex flex-row gap-2 w-full'>
                            <input
                                type="text"
                                className='border-2 border-red-300 rounded p-1 w-1/2'
                                placeholder='Max'
                                value={name}
                                disabled={true}
                            />
                            <input
                                type="text"
                                className='border-2 border-red-300 rounded p-1 w-1/2'
                                placeholder='Mustermann'
                                value={surname}
                                disabled={true}
                            />
                        </div>

                        <input
                            type="text"
                            className='border-2 border-black rounded p-1'
                            value={company_email}
                            placeholder='max@mustermann.lorem'
                            onChange={(e) => setCompany_email(e.target.value)}
                        />

                        <input
                            type="text"
                            className='border-2 border-black rounded p-1'
                            value={company_number}
                            placeholder='+010101010110'
                            onChange={(e) => setCompany_number(e.target.value)}
                        />

                        <input
                            type="text"
                            className='border-2 border-black rounded p-1'
                            placeholder='Wareneingang'
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />

                        <div className='flex flex-row gap-2'>
                            
                            <button 
                                className='border-2 w-full transition-shadow ease-in hover:shadow-md hover:shadow-black hover:bg-black border-black text-white bg-[#121212] text-l font-bold h-[3rem] rounded-lg'
                                onClick={handleProfileSave}
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                    <div className='grp1_2'>
                        
                        <div className="titel">
                            <h1 > Passwort ändern </h1>
                        </div>

                        <input
                            type="password"
                            className=''
                            placeholder='neues Passwort'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <button 

                            onClick={handlePwSave}
                        >
                            Speichern 
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditPage;





