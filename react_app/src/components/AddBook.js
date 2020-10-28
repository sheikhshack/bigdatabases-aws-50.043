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
    const [url, setUrl] = useState('')
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
            // if not url accepted, use default url
            if (url == '') {
                setUrl(`data:image/png;base64,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"alt="`)
            }
            const newBook = { title: title, author: author, price: price, description: description, url: url, categories: genreName }
            console.log(newBook)
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