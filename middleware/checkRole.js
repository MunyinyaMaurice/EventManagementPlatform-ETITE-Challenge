const asyncHandler = require("express-async-handler");

function checkRole(role) {
    return asyncHandler(async (req, res, next) => {
      if (req.user && req.user.roles.includes(role)) {
        next(); // User has the required role, proceed to the next middleware/route handler
      } else {
        res.status(403);
      throw new Error("User is not authorized");
      }
    });
  }
  
  module.exports = checkRole;