import React, { useState } from 'react';
import './styles/Form.css'
import authService from '../services/auth.service';

const Register = () => {

    const[username, setUsername] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const[message, setMessage] = useState('');
    const[messageType, setMessageType] = useState('error-message') // or success-message

    const handleSubmit = (e) => {
        e.preventDefault();

        authService.signup(username, email, password)
            .then((res) => {
                setMessageType('success-message');
                setMessage(res.data.message)
                
            })
            .catch((err) => {
                setMessageType('error-message');
                setMessage(err.response.data.message)
                console.log(err);
            })
    }


    return (
        <div className='form-container'>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor='username'>User</label>
                    <input 
                        type='text'
                        id='username'
                        value={username}
                        onChange = {(e) => setUsername(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type='email'
                        id='email'
                        value={email}
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button type="submit">Enter</button>

                {message && (
                    <div className={messageType}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    )
}

export default Register;