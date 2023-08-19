const mongoose = require( 'mongoose' )
const supertest = require( 'supertest' )
const helper = require( './utils/test-helper' )
const app = require( '../app.js' )
const api = supertest( app )
const bcrypt = require( 'bcrypt' )
const User = require( '../models/user' )

describe( 'when there is initially one user in db', () => {
    beforeEach( async () => {
        await User.deleteMany( {} )

        const password = await bcrypt.hash( 'sekret', 10 )
        const user = new User( { username: 'root', password } )

        await user.save()
    } )

    test( 'creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post( '/api/users' )
            .send( newUser )
            .expect( 200 )
            .expect( 'Content-Type', /application\/json/ )

        const usersAtEnd = await helper.usersInDb()
        expect( usersAtEnd ).toHaveLength( usersAtStart.length + 1 )

        const usernames = usersAtEnd.map( u => u.username )
        expect( usernames ).toContain( newUser.username )
    } )

    test( 'creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post( '/api/users' )
            .send( newUser )
            .expect( 400 )
            .expect( 'Content-Type', /application\/json/ )

        expect( result.body.error ).toContain( '`username` to be unique' )

        const usersAtEnd = await helper.usersInDb()
        expect( usersAtEnd ).toHaveLength( usersAtStart.length )
    } )
} )