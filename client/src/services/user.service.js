import axios from 'axios';
import authService from './auth.service';

const { refreshAccessToken } = authService;

const API_URL = 'http://localhost:8080/api/check/';

const verifyPermissions = async (requiredRole) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return Promise.reject('Se requiere iniciar sesión para ver este contenido');
    }

    const accessToken = user.accessToken;
    try {
        return await axios.get(API_URL + requiredRole, {
            headers: {
                'x-access-token' : accessToken
            }
        });
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message === 'Token de acceso expirado') {
            console.log('Token de acceso expirado')
            console.log('Se intentará obtener un nuevo token de acceso')
            try {
                const res = await refreshAccessToken(user.refreshToken);
                localStorage.setItem('user', JSON.stringify(res.data));
                console.log('Se genero un nuevo token de acceso y de refresco. Intentando ingresar..');
                return axios.get(API_URL + requiredRole, {
                    headers: {
                        'x-access-token': res.data.accessToken
                    }
                });
            } catch (refreshErr) {
                console.log('Error al intentar generar un nuevo token de actualización')
                console.log(refreshErr)
                throw refreshErr;
            }
        }
        throw err;
    }
};  

const UserService = {
    verifyPermissions,
}

export default UserService;