const bookRouter = require('express').Router();
const Meta = require('../model/book');
const utils = require('../utils/util')

//getting only title, imageURL, price
bookRouter.get('/all', async (req, res) => {
    const metadata = await Meta.find({}, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 })
    res.json(metadata)
})
//for main page book list, split querying book data into pages from index {value1} to index {value2}
bookRouter.get('/from=:value1/to=:value2', async (req, res) => {
    const selectedMetadata = await Meta.find({}, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 })
        .skip(parseInt(req.params.value1)).limit(parseInt(req.params.value2))
    res.json(selectedMetadata)
})
//query for books by author
bookRouter.get('/selectAuthor=:author', async (req, res) => {
    const books = await Meta.find({ author: req.params.author }, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 })
    res.json(books)
})

//query for individual book by asin
bookRouter.get('/selectAsin=:asin', async (req, res) => {
    const individualBook = await Meta.find({ asin: req.params.asin }, { _id: 0 })
    res.json(individualBook)
})
//query for book by title
bookRouter.get('/selectTitle=:title', async (req, res) => {
    const individualBook = await Meta.find({ title: req.params.title }, { _id: 0 })
    res.json(individualBook)
})

//add book with title, author, price (will add more later)
bookRouter.post('/add', async (req, res) => {
    const { title, author, price } = req.body;
    const asin = "ADD".concat(utils.asinStringGenerator(7));
    console.log(asin)
    const newBook = Meta({ title, author, asin, price });
    const addedBook = await newBook.save({ title, author, asin, price })
    res.json(addedBook)
});
//delete book by asin
bookRouter.delete('/delete=:asin', async (req, res) => {
    const deleteById = await User.findOneAndeDelete({ asin: req.params.asin })
    res.json(deleteById)
});

//count total number of book metadata
bookRouter.get('/count', async (req, res) => {
    const metadata = await Meta.find({}).count()
    res.json(metadata)
})



module.exports = bookRouter;