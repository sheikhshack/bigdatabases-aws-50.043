import React, { useState, useEffect } from 'react'
import {
    Switch, Route, Link, useRouteMatch, useParams, useHistory
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initUser, login, logout } from './reducers/userReducer'
import Navigation from "./components/Navigation";
import LoginModule from "./components/LoginForm";
import './styles/app.css'
import Center from 'react-center'


const App = () => {
    // Dispatchers and selectors //
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    // Effect hooks //
    useEffect(() => {
        try {
            dispatch(initUser())
        }
        catch (e){
            console.error(e)
        }
    }, [dispatch])

    const handleLogin =  (username, password) => {
        dispatch(login(username, password))
    }
    const handleLogout = async () => {
        dispatch(logout())
    }

    return (
        <>
            <Navigation />
            <Switch>
                <Route path="/users">
                    <h1>User page</h1>
                </Route>
                <Route path="/books">
                    <h1>Books page</h1>
                </Route>
                <Route path="/login">
                    <h1>Login page</h1>
                    <div className="container">
                        <LoginModule />
                    </div>
                </Route>
                <Route path="/">
                    <h1>Main page</h1>
                </Route>
            </Switch>
        </>
    )
}



export default App
