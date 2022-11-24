const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE 1 Fetching Notes ***Login Required***
router.get("/FetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.error);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 2 Adding Notes ***Login Required***
router.post(
  "/AddNotes",
  fetchUser,
  [
    body("title", "Title Must Be atleast 3 character").isLength({ min: 3 }),
    body("description", "Description Must Be aleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, tag } = req.body;
      const notes = await Notes.create({
        title,
        description,
        tag,
        user: req.user.id,
      });
      res.send(notes);
    } catch (error) {
      console.error(error.error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 3 Update Notes ***Login Required***
router.put("/updateNote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    let note = await Notes.findById(req.params.id)
    if(!note){
      return res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Denied")
    }
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});

  } catch (error) {
    console.error(error.error);
    res.status(500).send("Internal Server Error");
  }
});


//ROUTE 4 Delete Notes ***Login Required***
router.delete("/DeleteNote/:id", fetchUser, async (req, res) => {
  try {
    

    let note = await Notes.findById(req.params.id)
    if(!note){
      return res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Denied")
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note Has Been Delete", "note": note});

  } catch (error) {
    console.error(error.error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
