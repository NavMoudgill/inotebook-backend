const jwt = require("jsonwebtoken");
const fetchuser = (req, res, next) => {
  // get the user from jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (!data) {
      return res.status(401).send("Access denied");
    }
    req.user = data.myuser;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Sorry, Internal server error occurred ");
  }
};
module.exports = fetchuser;
