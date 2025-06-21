const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Create a new note
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newNote = new Note({
      title,
      content,
      userId: req.user.id,
    });

    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notes for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
