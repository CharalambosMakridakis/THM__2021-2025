import React, { useEffect, useState } from 'react';
import { getToken } from '../providers/AuthService';
import { useNavigate } from 'react-router-dom';

const ProfileImage: React.FC = () => {

    const navigate = useNavigate();
    const [img, setImg] = useState<string>('');

    useEffect(()=>{
        const token = getToken();
        if(!token) navigate('/login');

        const fetchImage = async () => {
            const response = await fetch('http://localhost:3000/api/get_profile_picture', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 401) {
                navigate('/login');
            }

            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setImg(imageObjectURL);
        };

        fetchImage();
    }, [navigate]);

    return (
        <img className='rounded-circle m-1' style={{ width: '4rem', height: '4rem' }} src={img} alt="icons" />
    );
};

export default ProfileImage;