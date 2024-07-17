import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SocketProvider } from './providers/SocketContext';
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Game from './pages/Game';
import Queue from './pages/Queue';
import Matchhistory from './pages/Matchhistory';
import ProfileSite from './pages/ProfileSite';
import AdminPanel from './pages/AdminPanel';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home /> 
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/queue",
        element: (<SocketProvider><Queue /></SocketProvider>)
    },
    {
        path: "/game/:id",
        element: (<SocketProvider><Game/></SocketProvider>)
    },
    {
        path: "/matchhistory",
        element: <Matchhistory />
    },
    {
        path: "/profilesite",
        element: <ProfileSite />
    },
    {
        path: "/admin",
        element: <AdminPanel />
    }
])

const App: React.FC = () => {
    return (
        <Container style={{ width: '100%' }}>
            <RouterProvider router={router} />
        </Container>
    );
};

export default App;

