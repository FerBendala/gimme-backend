const List = require( '../../models/list' )
const User = require( '../../models/user' )
const bcrypt = require( 'bcrypt' )
const initialLists = require( '../db/lists.json' )
const initialUsers = require( '../db/users.json' )

const nonExistingId = async () => {
    const newList = new List( {
        title: 'async/await simplifies making async calls',
        author: 'FullStackOpen',
        url: 'www.fullstackopen.com',
        likes: 3
    } )

    await newList.save()
    await newList.deleteOne()

    return newList._id.toString()
}

const listsInDb = async () => {
    const lists = await List.find( {} )
    return lists.map( list => list.toJSON() )
}

const usersInDb = async () => {
    const users = await User.find( {} )
    return users.map( u => u.toJSON() )
}

const createUser = async () => {
    await User.deleteMany( {} )

    const testUser = initialUsers[0]
    const passwordHash = await bcrypt.hash( testUser.password, 10 )
    const user = new User( {
        username: testUser.username,
        name: testUser.name,
        password: passwordHash
    } )

    const savedUser = await user.save()
    return savedUser.id
}

module.exports = {
    initialLists,
    nonExistingId,
    listsInDb,
    initialUsers,
    createUser,
    usersInDb,
}