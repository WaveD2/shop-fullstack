const User = require("../model/user");
const asyncHandler = require("express-async-handler");
// k cần sử dụng try-cath

const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !firstName || !lastName || !mobile) {
    return res.status(400).json({
      sucess: false,
      mes: "Missing data input",
    });
  }

  const response = await User.create(req.body);
  return res.status(200).json({
    sucess: response ? true : false,
    response,
  });
});

module.exports = {
  register,
};
