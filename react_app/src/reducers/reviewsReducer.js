import reviewService from '../services/reviewService'
import store from '../store'
import { setNotification } from "./notificationReducer";

// this is the goto reducer for Reviews //
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'GET_REVIEWS':
            // Add new reviews for specific book to store, and send updates store.
            return storeReviews(state,action.bookReviews)
        case 'ADD_REVIEW':
            // Add new review to specifc book json
            return addSingleReview(state,action.bookReview)
        default:
            return state

    }
}

export const getReviews = (asin, start, amount) => {
    return async dispatch => {
        try {
            console.log("this is my asin to get reviews")
            console.log(asin)
            const getReviews = await reviewService.reviewsBasedonAsin(asin,0,6)
            // TODO: Look into adding token into the reviewService
            dispatch({
                type: 'GET_REVIEWS',
                bookReviews: { 
                    asin: asin,
                    endIndex: start+amount,
                    reviews: getReviews
                 }
            })
        } catch (e) {
            // TODO: Insert notification stuff here
            dispatch(setNotification(`Oops, something went wrong with reviews for this book`, 'warning'))
        }
    }
}

export const addOneReview = (reviewText, reviewRating, reviewBook) => {
    return async dispatch => {
        try{
            const reviewAdded = await reviewService.addReview(reviewText, reviewRating, reviewBook)
            // TODO: Look into setting token to be null in the reviewService
            store.dispatch(setNotification("Congrats, your review has been added!", "success"))
            dispatch({
                type: 'ADD_REVIEW',
                bookReview: {
                    asin: reviewBook.asin,
                    review: reviewAdded
                }
            })
        }
        catch (e) {
            dispatch(setNotification(`Oops, we are having trouble posting your review`, 'warning'))
        }
    }
}

const storeReviews = (state, bookReviews) =>{
    state[bookReviews.asin] = {
        endIndex: bookReviews.endIndex,
        reviews: bookReviews.reviews
    }
    return state
}

const addSingleReview = (state, bookReview) => {
    state[bookReview.asin].reviews.unshift(bookReview.review)
    return state
}

export default reviewsReducer