// reducers
const notificationReducer = (state = null, action) => {
    switch (action.type){
    case 'SET':
        return action.data
    case 'REMOVE':
        return null
    default:
        return state
    }
}

// action creators


export const removeNotification = () => {
    return {
        type: 'REMOVE',
        data: null
    }
}

// export const clearNotification = () = {
//
// }

// this is really bad but idgaf
export const setNotification = (message, mode) => {
    return dispatch => {
        dispatch(removeNotification())
        const timer = setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)
        console.log('executed dispatch')
        dispatch({
            type: 'SET',
            data: {
                message,
                mode,
                timer
            }
        })
    }
}

// const throwActiveNotification =(message, mode) => {
//     clearTimeout(timer)
//     dispatch(setNotification(message, mode))
//     setTimer()
// }
export default notificationReducer