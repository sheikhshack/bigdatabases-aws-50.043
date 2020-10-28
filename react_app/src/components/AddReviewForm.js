import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Rating from '@material-ui/lab/Rating';
import InputLabel from '@material-ui/core/InputLabel';
import { Typography } from '@material-ui/core'
import Input from '@material-ui/core/Input';

const AddReviewForm = ({ onSubmit }) => {
    const [value, setValue] = React.useState(0);
  return (
      <FormControl>
      <Typography gutterBottom variant="h4" component="h4" >{'New Review'}</Typography>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <TextField id="standard-search" label="Review Text" type="search" />
        <br/>
        <Rating name="simple-controlled" value={value}
            onChange={(event, newValue) => {
            setValue(newValue);
            }}
        />
    </FormControl>
  );
};
export default AddReviewForm