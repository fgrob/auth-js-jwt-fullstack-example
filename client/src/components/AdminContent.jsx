import React, { useEffect, useState } from 'react';
import UserService from '../services/user.service';

const AdminContent = (requiredRole) => {
    const [adminPermissions, setAdminPermissions] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const res = await UserService.verifyPermissions(requiredRole.role);
                console.log('Status ' + res.status + ' : ' + res.data)
                setAdminPermissions(true)
                setErrorMessage('');
            } catch (err) {
                setAdminPermissions(false);
                try {
                    setErrorMessage(
                        err.response.status +
                        ' ' +
                        err.response.statusText +
                        ' : ' +
                        err.response.data.message
                    );
                } catch {
                    setErrorMessage(err)
                }
            }
        };

        checkPermissions();
    }, [])

    return (
        <div>
            {adminPermissions && (
                <div style={{ color : 'green'}}> Your are viewing exclusive content for Administrators </div>
            )}
            {errorMessage && (
                <div style={{ color: 'red'}}>{errorMessage}</div>
            )}
        </div>
    )
};

export default AdminContent;