const logsRouter = require('express').Router();
const Log = require('../model/log');
const utils = require('../utils/util')

// Removed this route due to logging related transparencies
// logsRouter.get('/specific=:pagenumber&limit=:limitnumber/sortby=:sorty&order=:order', async (req, res) => {
//     const pageNumber = parseInt(req.params.pagenumber) - 1
//     const sortyMorty = req.params.sorty //suports reviews and genres yet
//     const orderino = parseInt(req.params.order) // can be 1 or -1
//     const limitNumber = parseInt(req.params.limitnumber)
//     // sorts either by timestamp or by method
//     const selectedMetadata = sortyMorty === 'timestamp'
//         ? await Log.find({}, {}).sort({'timestamp': orderino}).skip(pageNumber * limitNumber).limit(limitNumber)
//         : await Log.find({}, {} ).sort({ 'meta.req.method': orderino }).skip(pageNumber * limitNumber).limit(limitNumber)
//     res.json(selectedMetadata)
// })

logsRouter.post('/', async (req, res) => {
    const pageNumber = parseInt(req.body.pagenumber) - 1
    const sortyMorty = req.body.sort //suprorts timestamp and method
    const orderino = parseInt(req.body.order) // can be 1 or -1
    const limitNumber = parseInt(req.body.limitnumber)
    // sorts either by timestamp or by method
    const selectedMetadata = sortyMorty === 'timestamp'
        ? await Log.find({}, {}).sort({'timestamp': orderino}).skip(pageNumber * limitNumber).limit(limitNumber)
        : await Log.find({}, {} ).sort({ 'meta.req.method': orderino }).skip(pageNumber * limitNumber).limit(limitNumber)
    res.json(selectedMetadata)
})

logsRouter.get('/test', async (req, res) => {
    const data = await Log.find({}).limit(5)
    console.log(data)
    res.json(data)
})

module.exports = logsRouter;
