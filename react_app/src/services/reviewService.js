import axios from 'axios'
const baseUrl = '/review'

const reviewsBasedonAsin = async (asin, start, amount) => {
    const response = await axios.post(baseUrl+`/filterBook/${asin}`,{start: start, amount: amount})
    return response.data
}

export default {reviewsBasedonAsin}