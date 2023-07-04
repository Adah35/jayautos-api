const express = require('express')
const { getUsers, CreateNewUser, updateUser, deleteUser, getSingleUser } = require('../controller/userController')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)
router.route('/')
    .get(getUsers)
    .post(CreateNewUser)
    .patch(updateUser)
    .delete(deleteUser)

router.get('/:id', getSingleUser)

module.exports = router