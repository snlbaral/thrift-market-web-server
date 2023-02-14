const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const token = req.header("access-token");
  try {
    const decode = jwt.verify(token, "thrifted");
    if (!decode.is_admin) {
      return res.status(400).send("Permission Denied.");
    }
    req.user = decode;
    next();
  } catch (err) {
    res.status("400").send(err.message);
  }
}
module.exports = adminAuth;
