const bookRouter = require('express').Router();
const Meta = require('../model/book');

bookRouter.get('/all', async (req, res) => {
    const metadata = await Meta.find()
    return res.json(metadata)
})

//add book

//remove book

//






module.exports = bookRouter;