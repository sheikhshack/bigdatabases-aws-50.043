import React, { useEffect, useState } from 'react'
import '../styles/bookStyle.css'
import bookService from '../services/bookService'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import BackIcon from '@material-ui/icons/ArrowBack'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import { useHistory } from 'react-router-dom'
import {setNotification} from "../reducers/notificationReducer";
import {useDispatch} from "react-redux";

const useStyles = makeStyles((theme) => ({
    row1: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    description: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

function getModalStyle() {
    return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }
}

const AddBook = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [asin, setAsin] = useState('')

    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle)
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const toMainPage = () => {
        const path = '/'
        history.push(path)
    }

    var body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Book Uploaded</h2>
            <p id="simple-modal-description">
                A new book "{title}" {asin} has been successfully added to the database
            </p>
            <Button variant='contained' color='primary' onClick={toMainPage} > Back to Main Page </Button>
        </div>
    )

    const handleAddBook = async (event) => {
        event.preventDefault()
        const newBook = { title: title, author: author, price: price, description: description }
        const addedBook = await bookService.addNewBook(newBook)
        // Notification system, it will happen over entire app. Refer to notification.js for diff modes
        dispatch(setNotification(`Added book with asin ${addedBook.asin}`, 'success'))
        console.log(addedBook)
        setAsin(addedBook.asin)
        handleOpen()
    }

    return (
        <form noValidate autoComplete="off" onSubmit={handleAddBook}>
            <Box mx={1}>
                <h5>
                    Fill in the fields to add a new book into the database
                </h5>
            </Box>
            <Box display='flex' flexWrap='wrap'>
                <Box m={1} flexGrow={1}>
                    <TextField type='text' value={title} onChange={e => setTitle(e.target.value)} className={classes.row1} id="outlined-basic1" label="Book Title" size="small" variant="outlined" />
                </Box>
                <Box m={1} flexGrow={1}>
                    <TextField type='text' value={author} onChange={e => setAuthor(e.target.value)} className={classes.row1} id="outlined-basic" label="Book Author" size="small" variant="outlined" />
                </Box>
                <Box m={1} flexGrow={1}>
                    <TextField type='text' value={price} onChange={e => setPrice(e.target.value)} className={classes.row1} id="outlined-basic" label="Price" size="small" variant="outlined" />
                </Box>
            </Box>
            <Box mx={1} mt={1}>
                <TextField type='text' value={description} onChange={e => setDescription(e.target.value)} className={classes.description} id="outlined-basic" size="small" label="Book Description" variant="outlined" multiline rows={3} />
            </Box>
            <Box m={10} />
            <Box display='flex' justifyContent='center'>
                <Box mx={2}>
                    <Button variant="contained" color="default" onClick={toMainPage} startIcon={<BackIcon />}>
                        Back
                    </Button>
                </Box>
                <Box mx={2}>
                    <Button type='submit' variant="contained" color="primary" startIcon={<SaveIcon />}>
                        Save Book
                    </Button>
                </Box>
            </Box>
            <Modal
                open={open}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>

        </form >
    )
}

export default AddBook