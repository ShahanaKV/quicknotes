const Note = require('../models/Note');

const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
