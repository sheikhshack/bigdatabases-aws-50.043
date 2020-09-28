import loginService from '../services/loginService'

// this is the goto reducer for User
const userReducer = (state = null, action) => {
    switch (action.type){
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
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))
            // TODO: Look into adding token into the reviewService
            dispatch({
                type: 'LOGIN_USER',
                data: { user }
            })
        } catch (e) {
            // TODO: Insert notification stuff here
        }
    }
}

export const logout = () => {
    return dispatch => {
        window.localStorage.removeItem('loggedInUser')
        // TODO: Look into setting token to be null in the reviewService
        dispatch({
            type:'LOGOUT_USER'
        })
    }
}
// this is a method to attempt to access session details from the local storage
export const initUser = () => {
    return dispatch => {
        try {
            const user = JSON.parse(window.localStorage.getItem('loggedInUser'))
            // blogService.setValidToken(JSON.parse(window.localStorage.getItem('loggedInUser')).token)
            dispatch({
                type: 'INIT_USER',
                data: { user }
            })
        } catch (e) {
            console.log('Not ready')
        }
    }
}

export const registerUser = (registrationObject) => {
    return async dispatch => {
        try {
            await loginService.register(registrationObject)
            dispatch({
                type:'REG_USER'
            })
        } catch (e){
            console.log('Registration Failed')
        }
    }
}

export default userReducer