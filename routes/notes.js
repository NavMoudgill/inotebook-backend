const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");

// Route 1:creating note of user using : POST "api/auth/createnotes"
//router authenticted //pass middlware
//insert a new note of a user
//infor title,desc,tag--->notes
//userId--->req(by using middleware)
router.post("/createnotes", fetchuser, async (req, res) => {
  try {
    let mynote = await Notes.create({
      title: req.body.title,
      description: req.body.description,
      userid: req.user.id,
      tag: req.body.tag,
      /* id payloaded taken by fetchuser middleware function */
    });
    return res.json({ mynote });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Sorry, Internal server error occurred" });
  }
});

// Route 2:update note of user using : PUT "api/auth/updatenote"

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    let mynote = await Notes.findOne({
      _id: req.params.id,
      userid: req.user.id,
    });
    if (!mynote) {
      return res.status(404).json({ error: "This note doesn't exists" });
    }
    const update = await Notes.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { ...req.body },
      {
        new: true,
      }
    );
    return res.json({ update });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Sorry, Internal server error occurred");
  }
});

// Route 3:delete note of user using : DELETE "api/auth/deletenote"
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let mynote = await Notes.findOne({
      _id: req.params.id,
      userid: req.user.id,
    });
    if (!mynote) {
      return res.status(400).json({ error: "This note doesn't exists" });
    }
    await Notes.findByIdAndDelete({
      _id: req.params.id,
    });
    return res.json({ MESSAGE: "Your note has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Sorry, Internal server error occurred");
  }
});

// Route 4:fetch notes of particularuser using : GET "api/auth/fetchallnotes"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ userid: req.user.id });
    return res.json({ notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Sorry, Internal server error occurred");
  }
});

module.exports = router;
/* 
responseHandler.js structure to do
{
  response:"",
  success:true,
  statusCode:200
}
errorHandler.js structure
{
  error:[{
    errorName:"",

  }],
  statusCode:400,
  success:false
}

*/
