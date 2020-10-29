import axios from 'axios'
import store from '../store'
const baseUrl = '/review'

const reviewsBasedonAsin = async (asin, start, amount) => {
    const response = await axios.post(baseUrl+`/filterBook/${asin}`,{start: start, amount: amount})
    return response.data
}

const addReview = async (reviewText, reviewRating, book) => {
    // const currentUser = store.getState().user
    // This book okay la, quite ma fan to read that is all
    const currentUser = {
        reviewerID: "AAAAAAA",
        reviewerName: "Jeroeeeeeee",
    }
    const reviewDate = dateFormatter()
    const unixReviewTime = Date.now()

    console.log('This is the book')
    console.log(book)

    const postBody = {
        asin: book.reviewBook.asin,
        reviewText: reviewText,
        overall: reviewRating,
        reviewTime: reviewDate,
        reviewerID: currentUser.reviewerID,
        reviewerName: currentUser.reviewerName,
        unixReviewTime: unixReviewTime
    }

    const response = await axios.post(baseUrl+'/addReview',postBody)
    return response.data
}

const dateFormatter = () =>{
    var today = new Date()
    var date = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var year = today.getFullYear();

    return month + ' ' + date +', ' + year
}

export default {reviewsBasedonAsin, addReview}