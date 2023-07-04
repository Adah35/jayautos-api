const User = require("../models/user");
const Note = require("../models/note");
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')



const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users.length) {
        return res.status(400).json({ message: 'No users Found' })
    }
    res.json(users)
})



const CreateNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicate

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: "username already exists" })
    }

    // hash the password
    if (password.length < 5) {
        return res.status(400).json({ message: "password can not be less than 5 characters" })
    }

    const hashedPwd = await bcrypt.hash(password, 10) //salt round

    const userObject = { username, "password": hashedPwd, roles }

    const user = await User.create(userObject)

    if (user) {
        return res.status(200).json({ message: `New user ${username} created` })
    } else {
        return res.status(400).json({ message: 'Invalid user data recieved' })
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, active, roles } = req.body

    // confirm data
    if (!id || !username || typeof active !== "boolean" || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // find user 
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "username already exists" })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // hash password
        hashPwd = await bcrypt.hash(password, 10)
        user.password = hashPwd
    }
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })


})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // check id
    if (!id) { return res.status(400).json({ message: "User ID required" }) }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has asigned notes' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }
    // if a user is deleted all his or her post should also be deleted
    // i will work on that later hopefully

    const result = await user.deleteOne()
    res.json({ message: `Username ${result.username} with ID ${result._id} deleted` })
})


const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    // check id
    if (!id) { return res.status(400).json({ message: "User ID required" }) }

    const user = await User.findById(id).select('-password').exec()
    if (!user) {
        return res.status(400).json({ message: "user not found" })
    }

    res.json(user)
})


module.exports = {
    getUsers,
    CreateNewUser,
    updateUser,
    deleteUser,
    getSingleUser
}
