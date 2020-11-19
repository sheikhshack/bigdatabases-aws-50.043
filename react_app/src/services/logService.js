import axios from 'axios'
const baseUrl = '/api/logs'

const getPaginatedLogs = async (logData) => {
    const response = await axios.post(baseUrl, logData)
    return response.data
}

export default {getPaginatedLogs}