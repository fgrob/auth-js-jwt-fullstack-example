import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import './styles/UserProfile.css';

const UserProfile = () => {

    const { currentUser } = useUserContext();

    return (
        <div className="user-profile">
            { currentUser ? (
                <>
                    <h2 className="profile-title">User Profile</h2>
                    <div className="profile-field">
                        <span className="field-label">ID:</span>
                        <span className="field-value">{currentUser.id}</span>
                    </div>
                    <div className="profile-field">
                        <span className="field-label">Username:</span>
                        <span className="field-value">{currentUser.username}</span>
                    </div>
                    <div className="profile-field">
                        <span className="field-label">Email:</span>
                        <span className="field-value">{currentUser.email}</span>
                    </div>
                    <div className="profile-field">
                        <span className="field-label">Roles:</span>
                        <ul className="roles-list">
                            {currentUser.roles.map((role, index) => (
                                <li key={index} className="role-item">{role}</li>
                                ))}
                        </ul>
                    </div>
                </>
            ) : (
                <div style={{color: 'red'}}>Login is required to view this content</div>
            )}
        </div>
    )
}

export default UserProfile;