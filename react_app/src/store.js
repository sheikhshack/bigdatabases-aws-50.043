import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import notificationReducer from './reducers/notificationReducer'
import bookReducer from './reducers/bookReducer'
import reviewsReducer from './reducers/reviewsReducer'

// Add all your reducers here
const reducer = combineReducers({
    user: userReducer,
    notification: notificationReducer,
    book: bookReducer,
    reviews: reviewsReducer
})

const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

export default store