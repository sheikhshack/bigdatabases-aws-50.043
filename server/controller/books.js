const bookRouter = require('express').Router();
const Meta = require('../model/book');
const utils = require('../utils/util')

//getting only title, imageURL, price
bookRouter.get('/all', async (req, res, next) => {
    const metadata = await Meta.find({}, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 })
    res.json(metadata)
})


bookRouter.get('/page=:pagenumber&limit=:limitnumber/sortby=:sorty&order=:order', async (req, res) => {
    const pageNumber = parseInt(req.params.pagenumber) - 1
    const sortyMorty = req.params.sorty //suports reviews and genres yet
    const orderino = parseInt(req.params.order) // can be 1 or -1
    const limitNumber = parseInt(req.params.limitnumber)
    const selectedMetadata = sortyMorty === 'reviews'
        ? await Meta.find({}, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 }).sort({ 'reviewCount': orderino }).skip(pageNumber * limitNumber).limit(limitNumber)
        : await Meta.find({}, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 }).sort({ 'categories': orderino }).skip(pageNumber * limitNumber).limit(limitNumber)
    res.json(selectedMetadata)
})

//for main page book list, split querying book data into pages from index {value1} to index {value2}
bookRouter.get('/from=:value1/to=:value2', async (req, res) => {
    const selectedMetadata = await Meta.find({}, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 })
        .skip(parseInt(req.params.value1)).limit(parseInt(req.params.value2))
    res.json(selectedMetadata)
})

bookRouter.get('/page=:pagenumber&limit=:limitnumber', async (req, res) => {
    const pageNumber = parseInt(req.params.pagenumber) - 1
    const limitNumber = parseInt(req.params.limitnumber)
    const selectedMetadata = await Meta.find({}, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 }).skip(pageNumber * limitNumber).limit(limitNumber)
    res.json(selectedMetadata)
})
//query for books by author
bookRouter.get('/selectAuthor=:author', async (req, res) => {
    // const books = await Meta.find({ author: req.params.author }, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 })
    const books = await Meta.find({ author: { $regex: req.params.author, $options: 'i' } }, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 })
    res.json(books)
})

//query for individual book by asin
bookRouter.get('/selectAsin=:asin', async (req, res) => {
    const individualBook = await Meta.find({ asin: req.params.asin }, { _id: 0 })
    // const resultMatches = await Meta.find({ asin: {$regex: req.params.asin, $options:'i'} }, { _id: 0 }).limit(20)
    res.json(individualBook)
})
//query for book by title
bookRouter.get('/selectTitle=:title', async (req, res) => {
    // const individualBook = await Meta.find({ title: req.params.title }, { _id: 0 })
    const resultMatches = await Meta.find({ title: { $regex: req.params.title, $options: 'i' } }, { title: 1, asin: 1, imUrl: 1, price: 1, author: 1, _id: 0 }).limit(20)

    res.json(resultMatches)
})

//add book with title, author, price (will add more later)
bookRouter.post('/add', async (req, res) => {
    const { title, author, price, imUrl, description, categories } = req.body;
    const asin = "ADD".concat(utils.asinStringGenerator(7));
    console.log(asin)
    const newBook = Meta({ title, author, asin, price, imUrl, description, categories });
    const addedBook = await newBook.save({ title, author, asin, price, imUrl, description, categories })
    res.json(addedBook)
});
//delete book by asin
bookRouter.delete('/delete=:asin', async (req, res) => {
    const deleteById = await Meta.findOneAndDelete({ asin: req.params.asin })
    res.json(deleteById)
});

//count total number of book metadata
bookRouter.get('/count', async (req, res) => {
    const metadata = await Meta.find({}).count()
    res.json(metadata)
})

///// Resource Grade Query /////

// core retrieval, to be used for going into one specific product page
bookRouter.get('/:asin', async (req, res) => {
    // const individualBook = await Meta.find({}).populate('metadata_beta', {asin: 1, title: 1, author: 1});
    const individualBook = await Meta.findOne({ asin: req.params.asin }).populate(['related_buys', 'related_views', 'related_views_and_buys']);

    // const individualBook = await Meta.findOne({ asin: req.params.asin }).exec()
    res.json(individualBook)
})



module.exports = bookRouter;