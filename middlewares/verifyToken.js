const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // token in headers
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req?.headers?.authorization.split(" ")[1]; // Tách Bearer Token => Token

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: "Invalid access token",
        });

      // console.log("response token decode verify", decode);
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require access token",
    });
  }
});

module.exports = {
  verifyAccessToken,
};
