const mongoose = require("mongoose");
const { Schema } = mongoose;
const notesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  userid: {
    type: String,
    required: true,
  },
});
// create a tables called notes
module.exports = mongoose.model("notes", notesSchema);
