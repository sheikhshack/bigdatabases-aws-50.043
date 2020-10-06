const reviewsRouter = require('express').Router();
const bodyParser = require('body-parser');
reviewsRouter.use(bodyParser.json())
const port = 3000

// RETRIEVE SPECIFIC REVIEW
reviewsRouter.get('/review/:reviewID', (req, res) => {
    // TODO: Conduct SELECT sql query to retrieve the review based on reviewID
  res.send('Hello World!')
})

// RETRIEVE REVIEWS BASED ON BOOKID
reviewsRouter.get('/review/:bookID', (req, res) => {
    // TODO: Conduct SELECT sql query to retrieve all reviews for specific
    // TODO: Decide what is the limit that we will send to frontend each time
    // TODO: How to keep track of the reviews that we have sent and the ones to send
        // Something like first 10, then the next time the same user requests, we need to send the next 10
    res.send('Hello World!')
  })

// ADD A NEW REVIEW
reviewsRouter.post('/review', (req, res) => {
    // TODO: Generate UID for new review
    // TODO: Check if all necessary information are ready to create a new review
    // TODO: Conduct the INSERT sql query to add review to database
    res.send('Hello World!')
  })


// DELETE REIVEW BASED ON REIVEWID
reviewsRouter.delete('/review/:reviewID', (req, res) => {
    // TODO: Use the necessary sql query to delete review based on reviewID given
    res.send('Hello World!')
  })

// UPDATE A SPECIFIC REVIEW
reviewsRouter.put('/review/:reviewID', (req, res) => {
    // TODO: Check to make sure all necessary information is available
    // TODO: Check to ensure data types are enforced
    // TODO: Conduct the necessary sql query to update the review based on reviewID given 
    res.send('Hello World!')
  })

// RETRIEVE REVIEWS BASED ON PROVIDED FILTERS
reviewsRouter.get('/review', (req, res) => {
    // TODO: figure out how to use query params to get the necessary filters
    // TODO: Parse the filters into the sql query statement
    // TODO: Decide what is the limit that we will send to frontend each time
    // TODO: How to keep track of the reviews that we have sent and the ones to send
        // Something like first 10, then the next time the same user requests, we need to send the next 10
    res.send('Hello World!')
  })

reviewsRouter.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})