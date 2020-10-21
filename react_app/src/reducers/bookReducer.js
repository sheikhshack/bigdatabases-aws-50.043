// EH jeremy this is the redux reducer. What it does is it adds a layer of state management to your app via Redux
// What I am trying to do here is to make the reducer also handle all API interactions between the app -> server
// That way I know i call once, and redux will be my bro and keep the state fresh. It also helps a lot in
// state management as im basically making sure every request goes through redux's pipe. Welcome to frontend

// const bookReducer = (state = [])
// import bookService from '../services/bookService';
// import singleBook from '../components/ShakeSingularBook';

// const bookReducer = (state = null, action) => {
//     return state
// }

// export const bookInfo = (bookKey) => {
//     return async dispatch => {
//         const fullBookInfo = await bookService.queryBookByAsin(bookKey)
//         dispatch({
//             data: { fullBookInfo }
//         })
//     }
// }

// export default bookReducer