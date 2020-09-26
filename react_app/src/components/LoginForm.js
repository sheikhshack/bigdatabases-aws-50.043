import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'


const LoginForm = ({ handleRegister, handleLogin }) => {
    return(
        <>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleLogin}>
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

    return(
        <>
            <Form>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridFN">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control placeholder="Adam" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLN">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control placeholder="Smith" />
                    </Form.Group>
                </Form.Row>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
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
                <LoginForm handleRegister={handleRegister} />
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