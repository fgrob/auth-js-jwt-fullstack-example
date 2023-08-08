import React from 'react';
import { useUserContext } from '../contexts/UserContext';

const UserContent = () => {
    const { currentUser } = useUserContext();

    return (
        <div>
            {currentUser ? (
                <div style={{ color: 'green'}}>Contenido para usuarios logeados</div>
            ):(
                <div style={{ color: 'red'}}>Se requiere iniciar sesión para ver este contenido</div>
            )}
        </div>        
    )
}

export default UserContent;