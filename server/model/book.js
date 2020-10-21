// metadata.js
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Define Schema for book Collection
const bookSchema = mongoose.Schema({
    title: { type: String, default: "no title yet" },
    author: { type: String, default: "no author yet" },
    asin: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, default: null },
    imUrl: { type: String },
    related: {
        also_bought: [String],
        also_viewed: [String],
        buy_after_viewing: [String]
    },
    categories: { type: Array },
    id: false,

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}
);


// Format Managing
bookSchema.set('toJSON', {
    virtuals: true,
    transform: (document, returnedObj) => {
        delete returnedObj.related
    }
})


// Virtualisations

bookSchema.virtual('related_buys', {
    ref: 'meta_Kindle_12k',
    localField: 'related.also_bought',
    foreignField: 'asin',
    justOne: false,
    options: { select: 'title author asin imUrl -_id ' }
})

bookSchema.virtual('related_views', {
    ref: 'meta_Kindle_12k',
    localField: 'related.also_viewed',
    foreignField: 'asin',
    justOne: false,
    options: { select: 'title author asin imUrl -_id ' }
})

bookSchema.virtual('related_views_and_buys', {
    ref: 'meta_Kindle_12k',
    localField: 'related.buy_after_viewing',
    foreignField: 'asin',
    justOne: false,
    options: { select: 'title author asin imUrl -_id ' }
})
module.exports = mongoose.model('meta_Kindle_12k', bookSchema, 'meta_Kindle_12k');