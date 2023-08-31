const listsRouter = require( 'express' ).Router()
const List = require( '../models/list' )
const User = require( '../models/user' )
const jwt = require( 'jsonwebtoken' )


listsRouter.get( '/', async ( request, response ) => {
    const lists = await List
        .find( {} )
        .populate( 'user', {
            username: 1,
            name: 1,
        } )

    response.json( lists )
} )

listsRouter.post( '/', async ( request, response ) => {
    // Set variables
    const token = request.token
    const { title, author, url, likes } = request.body

    // Verify if token is matching with SecretKey
    const decodedToken = jwt.verify( token, process.env.JWT_SECRET )
    if ( !decodedToken.id )
        return response
            .status( 401 )
            .json( { error: 'invalid user' } )


    // Find if token has a valid user id
    const tokenWithUserId = decodedToken.id
    const user = await User.findById( tokenWithUserId )

    // Set new List Schema
    const newList = new List( {
        title: title,
        author: author,
        url: url,
        likes: likes,
        user: user._id
    } )

    const savedList = await newList.save()
    user.lists = user.lists.concat( savedList._id )
    await user.save()

    response.json( savedList )
} )

listsRouter.get( '/:id', async ( request, response ) => {
    const list = await List.findById( request.params.id )

    // Return list if exists
    if ( list )
        response.json( list )
    else
        response.status( 404 ).end()
} )

listsRouter.delete( '/:id', async ( request, response ) => {
    // Set variables
    const token = request.token

    // Verify if token is matching with SecretKey
    const decodedToken = jwt.verify( token, process.env.JWT_SECRET )
    if ( !decodedToken.id )
        return response
            .status( 401 )
            .json( { error: 'invalid user' } )

    // Delete list if the userId is matching with decoded token id
    const tokenWithUserId = decodedToken.id
    if ( tokenWithUserId.toString() ) {
        await List.findByIdAndRemove( request.params.id )
        response.status( 204 ).end()
    } else {
        return response.status( 401 ).json( { error: 'unauthorized' } )
    }
} )

listsRouter.put( '/:id', async ( request, response ) => {
    // Set variables
    const token = request.token
    const { title, author, url, likes } = request.body

    // Verify if token is matching with SecretKey
    const decodedToken = jwt.verify( token, process.env.JWT_SECRET )
    if ( !decodedToken.id )
        return response
            .status( 401 )
            .json( { error: 'token missing or invalid' } )

    // Get elements from request and set new data for List Schema
    const tokenWithUserId = decodedToken.id
    const existingList = { title, author, url, likes }

    // Update list if the userId is matching with decoded token id
    if ( tokenWithUserId.toString() ) {
        const updatedList = await List
            .findByIdAndUpdate(
                request.params.id,
                existingList,
                { new: true }
            )

        response.json( updatedList )
    } else {
        return response
            .status( 401 )
            .json( { error: 'unauthorized' } )
    }
} )

module.exports = listsRouter