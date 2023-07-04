const Note = require("../models/note");
const User = require("../models/user")
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')



const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes.length) {
        return res.status(400).json({ message: 'No notes Found' })
    }
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user?.username }
    }))

    res.json(notesWithUser)
})



const CreateNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    // confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicate

    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: "Title already exists" })
    }

    const noteObject = { user, title, text }

    const note = await Note.create(noteObject)

    if (note) {
        return res.status(200).json({ message: `New note ${title} created` })
    } else {
        return res.status(400).json({ message: 'Invalid note data recieved' })
    }
})

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // confirm data
    if (!id || !user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // find note 
    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ message: 'note not found' })
    }

    // check for duplicate
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Title already exists" })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({ message: `${updatedNote.title} updated` })


})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // check id
    if (!id) {
        return res.status(400).json({ message: "Note ID required" })
    }

    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ message: "Note not found" })
    }

    const result = await note.deleteOne()
    res.json({ message: `Note ${result.title} with ID ${result._id} deleted` })
})


const getSingleNote = asyncHandler(async (req, res) => {
    const { id } = req.params

    // check id
    if (!id) { return res.status(400).json({ message: "Note ID required" }) }

    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ message: "Note not found" })
    }

    res.json(note)
})


module.exports = {
    getNotes,
    CreateNewNote,
    updateNote,
    deleteNote,
    getSingleNote
}
