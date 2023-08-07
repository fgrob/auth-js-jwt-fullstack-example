import React, { useState } from 'react';
import './styles/NavBar.css';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { useUserContext } from '../contexts/UserContext';


const NavBar = () => {

    // const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    const { currentUser } = useUserContext();

    const logout = () => {
        authService.logout();
    };

    return (
        <header className="header">
            <nav>
                <ul className="nav-container">
                    <li>
                        <Link to={'/'}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={'/user'}>
                            User Content
                        </Link>
                    </li>
                    <li>
                        <Link to={'/moderator'}>
                            Moderator Content
                        </Link>
                    </li>
                    <li>
                        <Link to={'/admin'}>
                            Admin Content
                        </Link>
                    </li>
                    
                    
                    {currentUser ? (
                        <>
                            <li className='user-sector'>
                                <Link to={'/profile'}>
                                    {currentUser.username}
                                </Link>
                            </li>
                            <li>
                                <a href='#' onClick={logout}>
                                    Logout
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className='user-sector'>
                                <Link to={'/login'}>
                                    Sign In
                                </Link>
                            </li>
                            <li className='signup'>
                                <Link to={'/register'}>
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}    
                </ul>
            </nav>
        </header>
    );
};

export default NavBar;
