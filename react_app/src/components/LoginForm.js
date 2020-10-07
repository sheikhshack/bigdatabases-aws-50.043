import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import useField from '../hooks/hooks'
import { removeReset, resetAll } from '../utils/resets'
import { useDispatch } from 'react-redux'
import { login, registerUser } from '../reducers/userReducer'
import {setNotification} from "../reducers/notificationReducer";


const LoginForm = ({ handleRegister }) => {
    // State hooks //
    const password = useField('password')
    const username = useField('text')
    // const email = useField('email')


    // Dispatcher //
    const dispatch = useDispatch()

    const handleLogin = (event) => {
        event.preventDefault()
        dispatch(login(username.value, password.value))
        resetAll(password, username)
    }


    return(
        <>
            <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail" >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type={username.type} placeholder="Enter email" value={username.value} onChange={username.onChange}/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type={password.type} placeholder="Password" value={password.value} onChange={password.onChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <Button variant="outline-primary" onClick={handleRegister}>
                    Sign-Up
                </Button>
            </Form>
        </>
    )

}

const RegisterForm  = () => {
    // State hooks //
    const name  = useField('text')
    const email = useField('email')
    const password = useField('password')
    const username = useField('text')

    const dispatch = useDispatch()


    const handleRegister = (event) => {
        event.preventDefault()
        console.log('User registering with credentials', { username, name, email, password } )
        setNotification(`Registration succeeded for ${username}`, 'success')
        dispatch(registerUser(name, username, email, password))
    }

    return(
        <>
            <Form onSubmit={handleRegister}>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridFN">
                        <Form.Label>Name</Form.Label>
                        <Form.Control {...removeReset(name)} placeholder='Adam' />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLN">
                        <Form.Label>Username</Form.Label>
                        <Form.Control placeholder="ironwalrus97" {...removeReset(username)}/>
                    </Form.Group>
                </Form.Row>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control placeholder="Enter email" {...removeReset(email)} />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control  placeholder="Password" {...removeReset(password)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>

            </Form>
        </>
    )

}


const LoginModule = () => {

    const [registerMode, setRegisterMode] = useState(false)

    const handleRegister = () => {
        setRegisterMode(true)
        console.log('Register Mode')
    }


    if (!registerMode) {
        return (
            <div>
                <h2>Login</h2>
                <LoginForm handleRegister={handleRegister}  />
            </div>)
    }
    else {
        return (
            <div>
                <h2>Sign Up</h2>
                <RegisterForm />
            </div>)
    }
}

export default LoginModule