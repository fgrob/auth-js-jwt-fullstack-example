import React from 'react';
import { useUserContext } from '../contexts/UserContext';

const UserContent = () => {
    const { currentUser } = useUserContext();

    return (
        <div>
            {currentUser ? (
                <div>Contenido para usuarios logeados</div>
            ):(
                <div>Favor iniciar sesión</div>
            )}
        </div>        
    )
}

export default UserContent;