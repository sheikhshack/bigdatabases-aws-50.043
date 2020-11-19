import axios from 'axios'
const baseUrl = '/api/user'

// function for handling login API
const login = async (credentials) => {
    console.log('Posting with', credentials)
    // credentials is object {email, pass}
    const response = await axios.post(baseUrl + '/login', credentials)
    return response.data
}

const register = async (registObject) => {
    const response = await axios.post(baseUrl + '/register', registObject)
    return response.data
}

export default { login, register }


