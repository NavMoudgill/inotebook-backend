const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://navi_react:DPLWej0Cpew3DUyv@cluster0.xydcsec.mongodb.net/inotebook?retryWrites=true&w=majority";
const connectToMongo = () => {
  // mongoose.connect return promise
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to Mongo Successfully");
    })
    .catch((error) => {
      console.log("Error connecting to Mongo");
    });
};
module.exports = connectToMongo;
