import React, { useState, useEffect } from 'react'
import {
    Switch, Route, Link, useRouteMatch, useParams, useHistory
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initUser, login, logout } from './reducers/userReducer'
import Navigation from './components/Navigation'
import LoginModule from './components/LoginForm'
import BookModule from './components/main/bookShelf/Books';
import SingleBookModule from './components/singleBook/SingleBook';
import './styles/app.css'
import Center from 'react-center'
import Notification from "./components/Notification";
import { removeNotification, setNotification } from "./reducers/notificationReducer";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import Book from './components/main/bookShelf/book/Book';


const App = () => {

    // Dispatchers and selectors //
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    // Hook declarations //
    const [timer, setTimer] = useState(0) // for active notifications


    // Effect hooks // - added init user
    useEffect(() => {
        try {
            dispatch(initUser())
        }
        catch (e) {
            console.error(e)
        }
    }, [dispatch])

    const handleLogin = (email, password) => {
        dispatch(login(email, password))
    }
    const handleLogout = async () => {
        dispatch(logout())
    }



    return (
        <>
            <Navigation user={user} />
            <Notification />
            <Switch>
                <Route path="/users">
                    <h1>User page</h1>
                </Route>
                <Route path="/bookReview">
                    <div className="container">
                        <SingleBookModule />
                    </div>
                </Route>
                <Route path="/login">
                    <h1>Login page</h1>
                    <div className="container">
                        <LoginModule />
                    </div>
                </Route>
                <Route path="/">
                    <h1>Book Database</h1>
                    <div className="container">
                        <BookModule />
                    </div>
                </Route>
            </Switch>
        </>
    )
}



export default App
