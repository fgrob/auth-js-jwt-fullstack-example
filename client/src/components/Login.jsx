import React, { useEffect, useRef, useState } from 'react';
import './styles/Form.css'
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const { setCurrentUser } = useUserContext();

    const usernameInputRef = useRef(null);

    useEffect(() => {
        usernameInputRef.current.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        authService.signin(username, password)
            .then(() => {
                setCurrentUser(authService.getCurrentUser());
                navigate('/profile');
            })
            .catch((err) => {
                setMessage('Error ' + err.response.request.status + '. ' + err.response.data.message);
            })
    };

    return (
        <div className='form-container'>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='username'>User </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        ref={usernameInputRef}

                    />
                </div>
                <div>
                    <label htmlFor='password'>Password </label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Enter</button>

                {message && (
                    <div className='error-message'>{message}</div>
                )}
            </form>
        </div>
    )

}

export default Login;