const jwt = require("jsonwebtoken");

const authenticateUserToken = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized - Token not provided" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err)
      return res.status(403).json({ error: "Unauthorized - Invalid token!" });
    req.user = data;
    next();
  });
};

module.exports = { authenticateUserToken };
