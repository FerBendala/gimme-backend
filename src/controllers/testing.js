const router = require( 'express' ).Router()
const List = require( '../models/list' )
const User = require( '../models/user' )

router.post( '/reset', async ( request, response ) => {
    await List.deleteMany( {} )
    await User.deleteMany( {} )

    response.status( 204 ).end()
} )

module.exports = router