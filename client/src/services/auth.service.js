import axios from 'axios';
import jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/auth/';

const signup = (username, email, password) => {
    return axios.post(API_URL + 'signup', { // the complete function is returned. Response and errors are handled directly upon invocation
        username,
        email,
        password
    })
};


const signin = (username, password) => {
    return axios.post(API_URL + 'signin', {
        username,
        password
    })
    .then((res) => {
        if (res.data.accessToken) { // if the response contains an accessToken, then the login was successful
            localStorage.setItem('user', JSON.stringify(res.data)); // save the accessToken and refreshToken locally
            return;
        } else {
            throw res.data // Capture the status and error message to be handled by the next catch in the chain (located where the invocation is)
        }
    })
};

const getCurrentUser = () => {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken; // retrieve the access token if it exists.
    if (token) {
        const decodedToken = jwt_decode(token);
        return {
            id: decodedToken?.id || null,
            email: decodedToken?.email || null,
            username: decodedToken?.username || null,
            roles: decodedToken?.roles || [],
        }
    }
};

const refreshAccessToken = (refreshToken) => {
    return axios.post(API_URL + 'refreshtoken', {refreshToken})
}

const logout = () => {
    const { refreshToken } = JSON.parse(localStorage.getItem('user'));
    return axios.post(API_URL + 'signout', { refreshToken })
        .then((res) => {
            console.log(res.data.message)
            localStorage.removeItem('user');
        })
};


const authService = {
    signup,
    signin,
    getCurrentUser,
    refreshAccessToken,
    logout
}

export default authService;