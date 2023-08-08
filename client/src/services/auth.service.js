import axios from 'axios';
import jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/auth/';

const signup = (username, email, password) => {
    return axios.post(API_URL + 'signup', { // se retorna la funcion completa, las respuestas y errores las manejo directamente en la invocación
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
        if (res.data.accessToken) { // si la respuesta contiene un accessToken, entonces fue un login exitoso. PROBAR ESTO!
            localStorage.setItem('user', JSON.stringify(res.data)); // guardamos el accessToken y el refreshToken en local
            return;
        } else {
            throw res.data // capturamos el status y mensaje del error para que sea manejando por el siguiente catch de la cadena (que está ubicado en la invocación)
        }
    })
};

const getCurrentUser = () => {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken; // obtenemos el token de acceso en caso de que exista
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