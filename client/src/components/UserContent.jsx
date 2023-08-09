import React from 'react';
import { useUserContext } from '../contexts/UserContext';

const UserContent = () => {
    const { currentUser } = useUserContext();

    return (
        <div>
            {currentUser ? (
                <div style={{ color: 'green'}}>Content for logged-in users</div>
            ):(
                <div style={{ color: 'red'}}>Login is required to view this content</div>
            )}
        </div>        
    )
}

export default UserContent;