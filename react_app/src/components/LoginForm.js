import React, { useState } from 'react'
import useField from '../hooks/hooks'
import { removeReset, resetAll } from '../utils/resets'
import { useDispatch } from 'react-redux'
import { login, registerUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const LoginForm = ({ handleRegister }) => {
    const classes = useStyles()

    // State hooks //
    const password = useField('password')
    const email = useField('email')
    const history = useHistory()
    // const email = useField('email')


    // Dispatcher //
    const dispatch = useDispatch()

    const handleLogin = (event) => {
        event.preventDefault()
        dispatch(login(email.value, password.value))
        history.push('/')
        resetAll(password, email)
    }

    const deadFunction = () => {
        dispatch(setNotification('This is db project, not frontend project', 'info'))
    }


    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleLogin}>
                        <TextField variant="outlined" margin="normal" required fullWidth id={email.type} label="Username"
                            name={email.type} autoComplete="email" autoFocus value={email.value} onChange={email.onChange}/>
                        <TextField variant="outlined" margin="normal" required fullWidth name={password.type} label="Password"
                            type={password.type} id="password" value={password.value} autoComplete="current-password" onChange={password.onChange}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" onClick={deadFunction}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={handleRegister}>
                                    {'Don\'t have an account? Register'}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        </>
    )

}

const RegisterForm = ({ handleLoginSwitch }) => {
    const classes = useStyles()

    // State hooks //
    const name = useField('text')
    const email = useField('email')
    const password = useField('password')
    const username = useField('text')

    const dispatch = useDispatch()


    const handleRegister = (event) => {
        event.preventDefault()
        if (!password.value || password.value.length < 10 || password.value.match(/^[A-Za-z]+$/) || password.value.match(/^[0-9]+$/)) {
            dispatch(setNotification('Please key in an alphanumeric password of minimum 10 characters', 'warning'))
            return 0
        }
        setNotification(`Registration succeeded for ${username}`, 'success')
        dispatch(registerUser(name.value, username.value, email.value, password.value))
        handleLoginSwitch()
    }

    return (
        <>
            <form className={classes.form} noValidate onSubmit={handleRegister}>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridFN">
                        <Form.Label>Name</Form.Label>
                        <Form.Control {...removeReset(name)} placeholder='Adam' />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLN">
                        <Form.Label>Username</Form.Label>
                        <Form.Control placeholder="ironwalrus97" {...removeReset(username)} />
                    </Form.Group>
                </Form.Row>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control placeholder="Enter email" {...removeReset(email)} />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control placeholder="Password" {...removeReset(password)} />
                </Form.Group>
                <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                    Register
                </Button>
                <Button variant="contained" color="secondary" className={classes.submit} onClick={handleLoginSwitch}>
                    Return to Login
                </Button>

            </form>
        </>
    )

}


const LoginModule = () => {

    const [registerMode, setRegisterMode] = useState(false)

    const handleRegister = () => {
        setRegisterMode(true)
        console.log('Register Mode')
    }

    const handleLoginSwitch = () => {
        setRegisterMode(false)
        console.log('Login Mode')
    }


    if (!registerMode) {
        return (
            <div>
                <LoginForm handleRegister={handleRegister} />
            </div>)
    }
    else {
        return (
            <div>
                <h2>Sign Up</h2>
                <RegisterForm handleLoginSwitch={handleLoginSwitch} />
            </div>)
    }
}

export default LoginModule