const reviewsRouter = require('express').Router();
const Review = require('../model/review');
const sequelize = require('../sql-connection')

const serverErrorReponse = {
  statusCode: 400,
  body: JSON.stringify({
    message: 'Server not responding',
  }),
};

reviewsRouter.get('/', async (req, res) => {
// TODO: figure out how to use query params to get the necessary filters
// TODO: Parse the filters into the sql query statement
// TODO: Decide what is the limit that we will send to frontend each time
// TODO: How to keep track of the reviews that we have sent and the ones to send
    // Something like first 10, then the next time the same user requests, we need to send the next 10
    const oneReview = Review.findOne({
      where:{
        asin: "B000FA64PA"
      }
    }).then((result) => {
      console.log(result)
      res.send(result)
    }).catch((error) => {
      console.log('shit hit the fan')
      res.send(error)
    });

})

// RETRIEVE SPECIFIC REVIEW
reviewsRouter.get('/:reviewID', (req, res) => {
  
  // Ensure that the reviewID is an int
  if(parseInt(req.param.reviewID)!= NaN){
    
    // Conduct SELECT sql query to retrieve the review based on reviewID
      const oneReview = Review.findOne({
        where:{
          id: req.params.reviewID
        }
      }).then((result) => {
        console.log(result)
        res.send(result)
      }).catch((error) => {
        console.log('shit hit the fan')
        res.send(badQueryMsgGen(error))
      });
    }
  else{
    res.send(badRequestMsgGen('reviewID must be integer'))
  }

})

// RETRIEVE REVIEWS BASED ON BOOKID
reviewsRouter.post('/:bookID', (req, res) => {
    // TODO: Conduct SELECT sql query to retrieve all reviews for specific
    // TODO: Decide what is the limit that we will send to frontend each time
    // TODO: How to keep track of the reviews that we have sent and the ones to send
        // Something like first 10, then the next time the same user requests, we need to send the next 10
    
    console.log(req.body)
    // Check if the offset values make sense
    try{
      checkOffsets(req.body.start, req.body.amount)

      var sqlQuery = 'SELECT * FROM kindle_Review_Data WHERE asin = "'+req.params.bookID+'" LIMIT '+req.body.start+','+req.body.amount

      const allBookReviews = sequelize.query(sqlQuery)
      .then((result) => {
        console.log(result)
        res.send(result)
      }).catch((error) => {
        console.log('shit hit the fan')
        console.log(error)
        res.send(badQueryMsgGen(error.message))
      })

      // const allBookReviews = Review.findAll({
      //   subQuery: false,
      //   where:{
      //     asin: req.params.bookID
      //   },
      //   offset:req.body.start,
      //   limit: req.body.amount,
      // }).then((result) => {
      //   console.log(result)
      //   res.send(result)
      // }).catch((error) => {
      //   console.log('shit hit the fan')
      //   console.log(error)
      //   res.send(badQueryMsgGen(error.message))
      // });
    }
    catch(err){
      console.log('Some error')
      console.log(err)
      res.send(badRequestMsgGen(err))
    }

    // checkOffsets(req.body)
    // res.send(req.body)
    // res.send('Hello World!')
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

  function badQueryMsgGen(message){
    return badRequestErrorReponse = {
      statusCode: 500,
      body: JSON.stringify({
        message: message,
      }),
    };
  }

  function badRequestMsgGen(message){
    return badRequestErrorReponse = {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for Cors support to work
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        message: message,
      }),
    };
  }

  function checkOffsets(start,amount){
    try{
      var numStart = parseInt(start)
      var numAmount = parseInt(amount)
      if(numAmount==NaN || numStart==NaN){
        throw 'Offset limits parsed are not numbers'
      }
      else if (numStart<0){
        throw 'Start parameter invalid. Query Limit error'
      }
    }
    catch (err){
      throw err
    }
  }
module.exports = reviewsRouter;