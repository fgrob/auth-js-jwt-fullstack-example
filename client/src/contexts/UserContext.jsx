import React, { createContext, useState, useContext } from 'react';
import authService from '../services/auth.service';

const UserContext = createContext();

export function useUserContext() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

    return (
        <UserContext.Provider value = {{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
}

