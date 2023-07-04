const express = require('express')
const { getNotes, CreateNewNote, updateNote, deleteNote, getSingleNote } = require('../controller/noteController')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)
router.route('/')
    .get(getNotes)
    .post(CreateNewNote)
    .patch(updateNote)
    .delete(deleteNote)
router.get('/:id', getSingleNote)

module.exports = router