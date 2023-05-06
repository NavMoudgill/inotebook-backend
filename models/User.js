const mongoose = require("mongoose");
const { Schema } = mongoose;
// mongoose setup what u want to insert in the database
// schema is a blueprint of the data, what type of data u want to insert
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
const myusersimple = mongoose.model("user", userSchema);
// myusersimple.createIndexes();
module.exports = myusersimple;
