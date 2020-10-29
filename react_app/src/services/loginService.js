import axios from 'axios'
const baseUrl = '/user'

// function for handling login API
const login = async (credentials) => {
    console.log('Posting with', credentials)
    // credentials is object {email, pass}
    const response = await axios.post('http://localhost:5000/login', credentials)
    return response.data
}

const register = async (registObject) => {
    const response = await axios.post('http://localhost:5000/user/register', registObject)
    return response.data
}

export default { login, register }


