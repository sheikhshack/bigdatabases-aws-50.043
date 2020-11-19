import axios from 'axios'
const baseUrl = '/api/book'

const getAllBooks = async () => {
    const response = await axios.get(baseUrl + '/all')
    return response.data
}

const getAllBooksRanged = async (startingRange, endingRange) => {
    const response = await axios.get(baseUrl + `/from=${startingRange}/to=${endingRange}`)
    return response.data
}

const getPaginatedBooks = async (pageNumber, limit = 20, sort=null, order=1) => {
    const response = sort !== null
        ? await axios.get(baseUrl + `/page=${pageNumber}&limit=${limit}/sortby=${sort}&order=${order}`)
        : await axios.get(baseUrl + `/page=${pageNumber}&limit=${limit}`)
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
    console.log(response.data)
    return response.data
}

const queryBookByAuthor = async (author) => {
    const response = await axios.get(baseUrl + `/selectAuthor=${author}`)
    return response.data
}

export default { getAllBooks, getAllBooksRanged, queryBookByAsin, singleBookMode, queryBookByAuthor, queryBookByTitle, getPaginatedBooks, addNewBook}

