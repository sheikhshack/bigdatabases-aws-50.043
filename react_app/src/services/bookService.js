import axios from 'axios'
const baseUrl = '/book'

const getAllBooks = async () => {
    const response = await axios.get(baseUrl + '/all')
    return response.data
}

const getAllBooksRanged = async (startingRange, endingRange) => {
    const response = await axios.get(baseUrl + `/from=${startingRange}/to=${endingRange}`)
    return response.data
}

const addNewBook = async (newBook) => {
    const response = await axios.post(baseUrl + '/add', newBook)
    return response.data
}

const deleteBookByAsin = async (asin) => {
    const response = await axios.delete(baseUrl + `/delete=${asin}`)
    // TBH here can just not return shit but i wanna implement some stuff
    return response.data
}

const queryBookByAsin = async (asin) => {
    const response = await axios.get(baseUrl + `/selectAsin=${asin}`)
    return response.data
}

const singleBookMode = async (asin) => {
    const response = await axios.get(baseUrl + `/${asin}`)
    return response.data
}

const queryBookByTitle = async (title) => {
    const response = await axios.get(baseUrl + `/selectTitle=${title}`)
    return response.data
}

const queryBookByAuthor = async (author) => {
    const response = await axios.get(baseUrl + `/selectAuthor=${author}`)
    return response.data
}

export default { getAllBooks, getAllBooksRanged, queryBookByAsin, singleBookMode }
