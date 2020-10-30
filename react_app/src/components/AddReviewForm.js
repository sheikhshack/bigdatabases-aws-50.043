import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import FormControl from '@material-ui/core/FormControl'
import Rating from '@material-ui/lab/Rating'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import store from '../store'
import reviewService from '../services/reviewService'
import { setNotification } from '../reducers/notificationReducer'
import {useSelector} from "react-redux";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    textField: {
        width: 1000,
        margin: 10,
    },
}))

const AddReviewForm = ({reviewBook, handleAddReview}) => {
    console.log(handleAddReview)

    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [value,setValue] = useState(0)
    const [reviewText, setText] = useState('')
    // Jose for your reference
    const user = useSelector(state => state.user)


    const history = useHistory()
    // store.dispatch({type:"user"})
    // const userAvailable = store.getState().user
    // const userAvailable = true

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const postReview = async (reviewText, reviewRating, reviewBook, handleAddReview) =>{
        if(reviewText!== null && reviewRating!= 0){
            const reviewAdded = await reviewService.addReview(reviewText, reviewRating, reviewBook)
            console.log(reviewAdded)
            store.dispatch(setNotification('Congrats, your review has been added!', 'success'))
            handleAddReview(reviewAdded)
            handleClose()
        }
        else{
            store.dispatch(setNotification('Please fill in all details', 'warning'))
        }

        // TODO:Add new review to review store
    }

    // if(userAvailable === null){
    if(user === null){
        // console.log(userAvailable)
        return(
            <div>
                <Button variant="contained" color='secondary'  onClick={handleOpen}>{'Add my review'}</Button>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <div className={classes.paper}>
                        <Grid container direction="column" justify="center" alignItems="center" spacing={2} >
                            <Grid item>
                                <Typography gutterBottom variant="h4" component="h4" >{'Login Required'}</Typography>
                            </Grid>
                            <Grid item>
                                <Button  variant='contained' color='primary' onClick={() => history.push('/login')}>{'Click here to login' } </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Modal>
            </div>
        )
    }
    else{
        // console.log('No need user')
        // console.log(userAvailable)
        return (
            <div>
                <Button variant="contained" color='secondary'  onClick={handleOpen}>{'Add my review'}</Button>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <Grid container direction="column"justify="center" spacing={2} >
                                <Grid item>
                                    <Typography gutterBottom variant="h4" component="h4" >{'My New Review'}</Typography>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="ReviewText"
                                        label="My Book Review"
                                        required
                                        InputProps={{
                                            classes: {
                                                input: classes.textField,
                                            },
                                        }}
                                        onBlur={e => {
                                            console.log(e.target.value)
                                            setText(e.target.value)
                                            console.log(e.target.value)
                                        }}
                                        multiline
                                        fullWidth={true}
                                        rows={10}
                                        placeholder="Write your review here"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" >{'My Book Rating'}</Typography>
                                </Grid>
                                <Grid item>
                                    <Rating name="simple-controlled"
                                        value={value}
                                        onChange={(event, newValue) => {
                                            setValue(newValue)
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color='secondary' onClick={() => postReview(reviewText,value,reviewBook,handleAddReview)}>{'Add my review'}</Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Fade>
                </Modal>
            </div>
        )
    }


}
export default AddReviewForm
//     const [value, setValue] = useState(0);
//   return (
//       <FormControl>
//       <Typography gutterBottom variant="h4" component="h4" >{'New Review'}</Typography>
//         <InputLabel htmlFor="my-input">Email address</InputLabel>
//         <Input id="my-input" aria-describedby="my-helper-text" />
//         <TextField id="standard-search" label="Review Text" type="search" />
//         <br/>
//     </FormControl>
//   );