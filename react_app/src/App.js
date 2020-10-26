import React, { useState, useEffect } from 'react'
import {
    Switch, Route, Link, useRouteMatch, useParams, useHistory
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initUser, login, logout } from './reducers/userReducer'
import Navigation from './components/Navigation'
import LoginModule from './components/LoginForm'
import testModule from './components/Paginator'
// import BookModule from './components/main/bookShelf/Books';
import FullBookInfo from './components/FullBookInfo';
import './styles/app.css'
import Center from 'react-center'
import Notification from './components/Notification'
import { removeNotification, setNotification } from './reducers/notificationReducer'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import BookModuleShakeRefactor from "./components/BookModuleShakeRefactor";
import Grid from "@material-ui/core/Grid";



const App = () => {

    // Dispatchers and selectors //
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)


    const [timer, setTimer] = useState(0) // for active notifications
    // const [query, setQuery] = useState('')
    const match = useRouteMatch("/book/:asin")
    const query = match
        ? String(match.params.asin)
        : null

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
                    <div className='container'>
                        {testModule()}
                    </div>
                </Route>
                <Route path="/book/:asin" >
                    <FullBookInfo asin={query} />
                    {/* <div className="container">
                    </div> */}
                </Route>
                <Route path="/login">
                    <h1>Login page</h1>
                    <div className="container">
                        <LoginModule />
                    </div>
                </Route>
                <Route path="/">
                    <h1>Books Page</h1>
                    <div className="container">
                        <Grid
                            container spacing={0}
                            direction="column"
                            alignItems='center'
                        >
                            <Grid>
                                <BookModuleShakeRefactor />
                            </Grid>
                        </Grid>
                    </div>
                </Route>
            </Switch>
        </>
    )
}



export default App
