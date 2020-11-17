import loginService from '../services/loginService'
import { setNotification } from './notificationReducer'
import reviewService from '../services/reviewService'

// this is the goto reducer for User //
const userReducer = (state = null, action) => {
    switch (action.type) {
    case 'LOGIN_USER':
        return action.data.user
    case 'LOGOUT_USER':
        return null
    case 'INIT_USER':
        return action.data.user
    case 'REG_USER':
        return null
    default:
        return state

    }
}
// this are the action creators. They make accessing the store easier //
export const login = (email, password) => {
    return async dispatch => {
        try {
            const user = await loginService.login({ email, password })
            dispatch(setNotification(`Welcome Back ${email}`, 'success'))
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))
            reviewService.setValidToken(user.token)
            // TODO: Look into adding token into the reviewService
            dispatch({
                type: 'LOGIN_USER',
                data: { user }
            })
        } catch (e) {
            // TODO: Insert notification stuff here
            dispatch(setNotification('Oops, wrong email or password there', 'warning'))
        }
    }
}

export const logout = () => {
    return dispatch => {
        window.localStorage.removeItem('loggedInUser')
        // TODO: Look into setting token to be null in the reviewService
        reviewService.setValidToken(null)
        console.log('triggered')
        dispatch({
            type: 'LOGOUT_USER'
        })
    }
}
// this is a method to attempt to access session details from the local storage
export const initUser = () => {
    return dispatch => {
        try {
            const user = JSON.parse(window.localStorage.getItem('loggedInUser'))
            reviewService.setValidToken(user.token)
            dispatch({
                type: 'INIT_USER',
                data: { user }
            })
        } catch (e) {
            console.log('Not ready')
        }
    }
}

export const registerUser = (name, username, email, password) => {
    return async dispatch => {
        try {
            await loginService.register({ name, username, email, password })
            dispatch({
                type: 'REG_USER'
            })
            dispatch(setNotification('Registration successful', 'success'))
        } catch (e) {
            console.log('Registration Failed')
            dispatch(setNotification(`Registration failed, ${e}`, 'warning'))


        }
    }
}

export default userReducer