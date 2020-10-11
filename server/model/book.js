// metadata.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define Schema for book Collection
const bookSchema = new Schema({
    title: {
        type: String,
        default: "no title yet"
    },
    author: {
        type: String,
        default: "no author yet"
    },
    asin: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: null
    },
    imUrl: {
        type: String,
    },
    related: {
        also_bought: {
            type: [String],
        },
        also_viewed: {
            type: [String],
        },
        buy_after_viewing: {
            type: [String],
        }
    },
    categories: {
        type: Array
    },

},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('metadata_beta', bookSchema, 'metadata_beta');