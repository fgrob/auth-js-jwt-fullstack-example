import axios from 'axios';
import authService from './auth.service';

const { refreshAccessToken } = authService;

const API_URL = 'http://localhost:8080/api/check/';

const verifyPermissions = async (requiredRole) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return Promise.reject('Login is required to view this content');
    }

    const accessToken = user.accessToken;
    try {
        return await axios.get(API_URL + requiredRole, {
            headers: {
                'x-access-token' : accessToken
            }
        });
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message === 'Access token expired') {
            console.log('Access token expired') // delete this in production
            console.log('An attempt will be made to obtain a new access token') // delete this in production
            try {
                const res = await refreshAccessToken(user.refreshToken);
                localStorage.setItem('user', JSON.stringify(res.data));
                console.log('New access and refresh tokens generated successfully'); // delete this in production
                console.log('An attempt will be made to request access again'); // delete this in production
                return axios.get(API_URL + requiredRole, {
                    headers: {
                        'x-access-token': res.data.accessToken
                    }
                });
            } catch (refreshErr) {
                console.log(refreshErr?.response?.data?.message || 'Error while trying to generate a new refresh token')
                localStorage.removeItem('user');
                window.location.href = '/login';
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