import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../providers/AuthService';
import { Button, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import ProfilePanel from './ProfilePanel';

interface HeaderProps {
    current: string,
    disableProfile: boolean
}

const Header: React.FC<HeaderProps> = ({current, disableProfile}) => {

    const navigate = useNavigate();
    

    useEffect(()=>{
        const token = getToken();
        if(!token) navigate('/login');
    }, [navigate]);

    const links = [
        {tag: 'Home', route: '/'},
        {tag: 'Queue', route: '/queue'},
        {tag: 'Matchhistory', route: '/matchhistory'},
        {tag: 'Admin-Panel', route: '/admin'},
        {tag: 'Profile', route: '/profilesite'},
    ]

    return (
        <Row className='justify-content-between' style={{ marginBottom: '3rem', marginTop: '1rem' }}>
            <Col>
                <Navbar>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {
                                links.map((link, index) => {
                                    if(link.tag === current) return <Link key={index} style={{ textDecoration: 'underline', color: 'black', fontSize: '30px', fontWeight: '40px' }} to={link.route} className="nav-link">{link.tag}</Link>
                                    return <Link key={index} style={{ fontSize: '30px', fontWeight: '40px' }} to={link.route} className="nav-link">{link.tag}</Link>
                                })
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Col> 
            <Col xs="auto">
                <Container>
                    { !disableProfile ? <ProfilePanel /> : null }
                </Container>
                <Container>
                    <Button
                        style={{ width: '100%', fontWeight: 'bold'}}
                        variant='danger'
                        onClick={()=> {
                            removeToken();
                            navigate('/login');
                        }}
                    >
                        LogOut
                    </Button>
                </Container>
            </Col>
        </Row>    
    );
};

export default Header;
