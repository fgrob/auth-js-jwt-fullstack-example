import React, { useEffect, useState } from 'react';
import UserService from '../services/user.service';
import { useNavigate } from 'react-router-dom';

const AdminContent = () => {
    const REQUIRED_ROLE = 'admin';
    const [adminPermissions, setAdminPermissions] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const res = await UserService.verifyPermissions(REQUIRED_ROLE);
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
                // navigate('/login');
            }
        };

        checkPermissions();
    }, [])

    return (
        <div>
            {adminPermissions && (
                <div style={{ color : 'green'}}> Estás viendo contenido exclusivo para Administradores </div>
            )}
            {errorMessage && (
                <div style={{ color: 'red'}}>{errorMessage}</div>
            )}
        </div>
    )
};

export default AdminContent;