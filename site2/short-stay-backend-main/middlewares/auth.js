const jwt = require("jsonwebtoken");
const sendResponse = require("../services/response");

const isAuthenticated = (req, res, next) => {
  let token = req.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return sendResponse({
      status: "fail",
      statusCode: 401,
      message: "Unauthorized Access!",
      res,
    });
  }

  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendResponse({
        status: "fail",
        statusCode: 401,
        message: "Invalid token!",
        res,
      });
    }
    req.decoded = decoded;
    next();
  });
};


const isAdmin = (req, res, next) => {
  if (req.decoded?.role === "admin") {
    return next();
  }

  return sendResponse({
    status: "fail",
    statusCode: 403,
    message: "Access denied. Admins only.",
    res,
  });
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
