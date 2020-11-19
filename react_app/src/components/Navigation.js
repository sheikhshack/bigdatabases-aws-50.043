import React from 'react'
import { Link, Route, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'
import bookService from '../services/bookService'
import { Redirect } from 'react-router-dom'
import { useEffect, useState } from 'react'

import SelectInput from '@material-ui/core/Select/SelectInput'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import { fade, makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import BookIcon from '@material-ui/icons/Book'
import { MemoryRouter as Router } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'


const Navigation = ({ user }) => {

    const [searchBy, setsearchBy] = useState('Title')

    const handleChange = (event) => {
        setsearchBy(event.target.value)
    }
    //hook to store URL
    const [state, setState] = useState('')

    //hook to store user input
    const [input1, setInput] = useState('')

    const dispatch = useDispatch()

    const history = useHistory()

    const logoutFromNav = () => {
        if (window.confirm('Wanna log out?')){
            dispatch(logout())
        }

    }

    const options = [
        { name: 'Title', value: 'title' },
        { name: 'Author', value: 'author' },
    ]

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            '& .MuiFormLabel-root': { color: 'white' },
            '& .MuiInputBase-root':{ color: 'white' }

        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        buttons: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        addbookButton: {

        },
        title: {
            flexGrow: 1,
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(0),
                width: 'auto',
            },
        },
        searchIcon: {
            marginLeft: theme.spacing(2.5)
            // padding: theme.spacing(1, 2),
            // height: '100%',
            // position: 'absolute',
            // pointerEvents: 'none',
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 2),
            // vertical padding + font size from searchIcon
            paddingRight: `calc(1em + ${theme.spacing(1)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '22ch',
                },
            },
        },
        searchSelector: {
            margin: theme.spacing(1),
            //minWidth: 80,
            font: 1,
            color: 'inherit',
            display: 'inline-block',
        }
    }))

    const classes = useStyles()

    if (state != ''){
        return (<Redirect to={state}/>)}
    else{
        return (

            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={() => history.push('/')}
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                            <BookIcon fontSize="large"/>
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            DB Project
                        </Typography>
                        <Router>
                            <div className={classes.buttons}>
                                <Button color="inherit" href = "/">
                                Home
                                </Button>
                                <Button color="inherit" href = "/logs">
                                Logs
                                </Button>
                                {/* <Button color="inherit" href = "/login">
                                Login
                                </Button> */}
                                {user === null
                                    ?<Button color="inherit" onClick={() => history.push('/login')}>LOGIN</Button>
                                    :<Button color="inherit" onClick={logoutFromNav}>Hi {user.name}</Button> }
                            </div>
                            <IconButton
                                edge="start"
                                className={classes.addbookButton}
                                color="inherit"
                                aria-label="open drawer"
                                href = "/add-book"
                            >
                                <AddCircleIcon fontSize="large"/>
                            </IconButton>
                            <div className={classes.searchSelector}>

                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={searchBy}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'Title'}>Title</MenuItem>
                                    <MenuItem value={'Author'}>Author</MenuItem>
                                </Select>
                            </div>
                            <div className={classes.search}>

                                <SearchIcon className={classes.searchIcon}
                                    onClick = {(e) => {
                                        history.push(`/${searchBy}/search-results/${input1}`)
                                        console.log('Search Button Clicked')
                                    }}
                                />

                                <InputBase
                                    placeholder="Search…"
                                    onChange={(e) => setInput(e.target.value)}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                    onKeyPress={(ev) => {
                                        if (ev.key === 'Enter')
                                        {
                                            history.push(`/${searchBy}/search-results/${input1}`)
                                        }
                                    }}
                                />
                            </div>
                        </Router>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }


}

export default Navigation