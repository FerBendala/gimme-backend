const mongoose = require( 'mongoose' )

const listSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
} )

listSchema.set( 'toJSON', {
    transform: ( document, returnedObject ) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
} )

const List = mongoose.model( 'List', listSchema )
module.exports = List