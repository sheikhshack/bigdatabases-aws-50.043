import React, { useEffect, useState } from 'react'
import '../styles/bookStyle.css'
import bookService from '../services/bookService'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import BackIcon from '@material-ui/icons/ArrowBack'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal';
import { useHistory } from "react-router-dom";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const genres =
    ['Action and Adventure',
        'Classics',
        'Comic Book or Graphic Novel',
        'Detective',
        'Fantasy',
        'Dystopian',
        'Mystery',
        'Horror',
        'Thriller',
        'Paranormal',
        'Romance',
        'Short Stories',
        'Historical Fiction',
        'Literary Fiction',
        'Science Fiction',
        `Women's Fiction`,
        'Memoir',
        'Cooking',
        'Biographies and Autobiographies',
        'Art',
        'Crime',
        'Self-help / Personal',
        'Development',
        'Motivational',
        'Health',
        'History',
        'Travel',
        'Guide / How-to',
        'Families & Relationships',
        'Humor',
        'Children']

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
    formControl: {
        display: 'flex',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    alert: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(1),
        },
    },
}));

const Alert = (props) => {
    return <MuiAlert elevation={10} variant="filled" {...props} />;
}

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 400,
            width: 400,
        },
    },
};

function getStyles(genre, genreName, theme) {
    return {
        fontWeight:
            genreName.indexOf(genre) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function getModalStyle() {
    return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }
}

const AddBook = () => {

    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [asin, setAsin] = useState('')
    const [url, setUrl, getUrl] = useState('')
    const [genreName, setGenreName] = useState([]);
    const [tick, setTicked] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState(false);

    const clearState = () => {
        setTitle('')
        setAuthor('')
        setPrice('')
        setDescription('')
        setUrl('')
        setTicked(false)
    }

    const handleOpen = () => {
        setOpen(true);
    };
    const handleTick = (e) => {
        setTicked(e.target.checked)
        if (tick == false) {
            console.log('ticked')
            setUrl('https://saccar.com/wp-content/uploads/2016/03/amazon-no-image-available.png')
        }
        else if (tick == true) {
            console.log('unticked')
            setUrl('')
        }

    }
    const toMainPage = () => {
        const path = '/'
        history.push(path)
    }
    const handleChange = (e) => {
        setGenreName(e.target.value)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    };

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
        if (title == '' || author == '' || genreName.length == 0 || isNaN(price)) {
            setAlert(true);
        }
        else {
            console.log(url)
            const output = [genreName]
            const newBook = { title: title, author: author, price: price, description: description, imUrl: url, categories: output }
            console.log('testtest')
            console.log(newBook)
            // console.log(url)
            // const newBook = { title: title, author: author, price: price, description: description, url: url, categories: genreName }
            // console.log('testtest')
            // console.log(newBook)
            const addedBook = await bookService.addNewBook(newBook)
            console.log(addedBook)
            setAsin(addedBook.asin)
            handleOpen()
        }

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
                    <TextField required type='text' value={title} onChange={e => setTitle(e.target.value)} className={classes.row1} id="outlined-basic1" label="Book Title" size="small" variant="outlined" />
                </Box>
                <Box m={1} flexGrow={1}>
                    <TextField required type='text' value={author} onChange={e => setAuthor(e.target.value)} className={classes.row1} id="outlined-basic" label="Book Author" size="small" variant="outlined" />
                </Box>
                <Box m={1} flexGrow={1}>
                    <TextField type='text' value={price} onChange={e => setPrice(e.target.value)} className={classes.row1} id="outlined-basic" label="Price" size="small" variant="outlined" />
                </Box>
            </Box>
            <Box mx={1} mt={1}>
                <TextField type='text' value={description} onChange={e => setDescription(e.target.value)} className={classes.description} id="outlined-basic" size="small" label="Book Description" variant="outlined" multiline rows={3} />
            </Box>
            <Box display='flex' flexWrap='wrap' >
                <Box mt={2} mx={1} flexGrow={1}>
                    <TextField type='text' disabled={tick} value={url} onChange={e => setUrl(e.target.value)} id="outlined-basic" className={classes.row1} label="Book Image Url" size="small" variant="outlined" />
                </Box>
                <Box mx={1} mt={1.5}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tick}
                                onChange={handleTick}
                                name="checkbox"
                                color="primary"
                            />
                        }
                        label={<span style={{ fontSize: '0.75rem' }}>{"I do not have an image of the book"}</span>}
                    />
                </Box>
            </Box>
            <Box mt={1} mx={1.5}>
                <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-mutiple-checkbox-label">Book Categories (select at least 1)</InputLabel>
                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={genreName}
                        onChange={handleChange}
                        input={<Input />}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {genres.sort().map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                <Checkbox color='primary' checked={genreName.indexOf(genre) > -1} />
                                <ListItemText primary={genre} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <Snackbar open={alert} autoHideDuration={1500} onClose={handleClose} anchorOrigin={{ vertical: "center", horizontal: "center" }}>
                    <Alert severity="warning">
                        Please fill in the required fields * and numerical values for book price
                </Alert>
                </Snackbar>
            </Box>

            <Box m={10} />
            <Box mb={2} display='flex' justifyContent='center'>
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