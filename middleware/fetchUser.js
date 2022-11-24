const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({ error: "Access Denied" });
    }
    const data = jwt.verify(token, "verificatonkeytotoken");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Access Denied" });
  }
};

module.exports = fetchUser;
