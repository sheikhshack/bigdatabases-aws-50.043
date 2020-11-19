import axios from 'axios'
const baseUrl = '/api/review'


// init the api with the token for user auth

let token= null

const setValidToken = (tokenNew) => {
    token = tokenNew
}

const reviewsBasedonAsin = async (asin, start, amount) => {
    const response = await axios.post(baseUrl+`/filterBook/${asin}`,{ start: start, amount: amount })
    return response.data
}

const addReview = async (reviewText, reviewRating, book) => {
    // const currentUser = store.getState().user
    // This book okay la, quite ma fan to read that is all
    // const currentUser = {
    //     reviewerID: tokenUserHack.username,
    //     reviewerName: tokenUserHack.name,
    // }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const reviewDate = dateFormatter()
    const unixReviewTime = Date.now()

    console.log('This is the book')
    console.log(book)

    const postBody = {
        asin: book.asin,
        reviewText: reviewText,
        overall: reviewRating,
        reviewTime: reviewDate,
        unixReviewTime: unixReviewTime
    }

    const response = await axios.post(baseUrl+'/addReview',postBody, config)
    return response.data
}

const dateFormatter = () => {
    const today = new Date()
    const date = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    const year = today.getFullYear()

    return month + ' ' + date +', ' + year
}

export default { reviewsBasedonAsin, addReview, setValidToken }