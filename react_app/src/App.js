import React, { useState, useEffect } from 'react'
import {
    Switch, Route, Link, useRouteMatch, useParams, useHistory
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initUser, login, logout } from './reducers/userReducer'
import Navigation from './components/Navigation'
import LoginModule from './components/LoginForm'
// import BookModule from './components/main/bookShelf/Books';
import FullBookInfo from './components/FullBookInfo';
import AddBook from './components/AddBook'
import './styles/app.css'
import Center from 'react-center'
import Notification from './components/Notification'
import { removeNotification, setNotification } from './reducers/notificationReducer'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import BookModuleShakeRefactor from "./components/BookModuleShakeRefactor";
import Grid from "@material-ui/core/Grid";
import SearchResultCard from './components/SearchResultCard'
import SearchResultPage from './components/SearchResultPage'
import LogsPage from './components/LogsPage'


const App = () => {

    // Dispatchers and selectors //
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    console.log("user state:" + user)


    const [timer, setTimer] = useState(0) // for active notifications
    // const [query, setQuery] = useState('')
    const match2 = useRouteMatch("/:searchtype/search-results/:searchinput")
    const query2 = match2
        ? String(match2.params.searchinput)
        : null
    const query3 = match2
        ? String(match2.params.searchtype)
        :null
    console.log("route in app.js searchinput:" + query2)
    console.log("route in app.js searchtype:" + query3)

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
                <Route path="/:searchtype/search-results/:searchinput">
                    <div className='container'>
                        <SearchResultPage searchtype={query3} searchinput={query2}/>
                    </div>
                </Route>
                <Route path="/add-book">
                    <div className='container'>
                        <AddBook />
                    </div>
                </Route>
                <Route path="/users">
                    <h1>User page</h1>
                    <div className='container'>
                    </div>
                </Route>
                <Route path="/logs">
                    <h1>Logs</h1>
                    <div >
                        <LogsPage />
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
                    <div>
                        <BookModuleShakeRefactor />
                    </div>
                </Route>
            </Switch>
        </>
    )
}



export default App
