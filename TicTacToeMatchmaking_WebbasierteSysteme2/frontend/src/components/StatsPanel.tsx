import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../providers/AuthService';
import { PieChart } from '@mui/x-charts/PieChart';

const StatsPanel: React.FC = () => {

    const navigate = useNavigate();
    const [statData, setStatData] = useState<{playerId: string , wins: number, losses: number , draws: number } | null>(null);

    useEffect(()=>{
        const token = getToken();
        if(!token) navigate('/login');

        const fetchStats = async () => {
            
            try {
                const response = await fetch('http://localhost:3000/matchstats/stats', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                
                if (response.status === 401) {
                    navigate('/login');
                }else if (response.ok) {
                    const responseBody: { stats: { playerId: string , wins: number, losses:number , draws:number } } = await response.json();

                    if(responseBody){
                        setStatData(responseBody.stats);
                    }else{
                        console.log('Failed to fetch stats');
                    }
                } else {
                    console.error('Loading Stats failed!');
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        }
        
        fetchStats();
    }, [navigate]);

    return (
        <Container className='mx-auto'>
            <Container style={{ marginTop:'3rem', display: 'flex', justifyContent: 'center' }} >
                <PieChart
                    colors={['red', 'orange', 'green']}
                    series={[
                        {
                            data: [
                                { id: 0, value: statData?.wins ?? 0, color: 'green', label: 'Wins'},
                                { id: 1, value: statData?.draws ?? 0, color: 'orange', label: 'Draws' },
                                { id: 2, value: statData?.losses ?? 0, color: 'red', label: 'Losses'},
                            ],
                        },
                    ]}
                    width={800}
                    height={300}
                />
            </Container>
        </Container>
    );
};

export default StatsPanel;
