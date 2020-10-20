import React, { useState, useEffect } from 'react'
import {
    Switch, Route, Link, useRouteMatch, useParams, useHistory
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initUser, login, logout } from './reducers/userReducer'
import Navigation from './components/Navigation'
import LoginModule from './components/LoginForm'
import testModule from './components/User'
// import BookModule from './components/main/bookShelf/Books';
import FullBookInfo from './components/FullBookInfo';
import './styles/app.css'
import Center from 'react-center'
import Notification from './components/Notification'
import { removeNotification, setNotification } from './reducers/notificationReducer'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import BookModuleShakeRefactor from "./components/BookModuleShakeRefactor";



const App = () => {

    // Dispatchers and selectors //
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)


    const [timer, setTimer] = useState(0) // for active notifications
    const match = useRouteMatch("/book/:asin")

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
                <Route path="/book/:asin" children={<FullBookInfo />}>
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
                    {/* <p>FOr the code, i make it such that it uses only 2 component, ShakeSingularBook for each book, and
                    BookModuleShakeRefactor. I have swapped over from class based to function based. Trust me it is mmmuuchh
                    muuch better. ALso the lady's code is farking garbage, I rather we use bootstrap cos her shit not even
                    responsive
                    Please read about bootstrap and read the docs for react-bootstrap, we can use that to make our life so much
                    easier than adjusting the css like shag bro</p> */}
                    <div className="container">
                        <BookModuleShakeRefactor />
                    </div>
                </Route>
            </Switch>
        </>
    )
}



export default App
