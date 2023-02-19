const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const User = require("../model/user");
//asyncHandler k cần sử dụng try-cath
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
// POST [api/register]
const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  // Check Condition
  if (!email || !password || !firstName || !lastName || !mobile) {
    return res.status(400).json({
      sucess: false,
      mes: "Missing data input",
    });
  }

  const userRes = await User.findOne({ email });
  if (userRes) {
    // checked have user
    throw new Error("User has existed");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      newUser,
    });
  }
});

// POST [api/login]
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      sucess: false,
      mes: "Missing data input",
    });
  }

  const response = await User.findOne({ email: email });

  const isSuccessLogin = await response.isCorrectPassword(password);
  if (response && isSuccessLogin) {
    // Found non-callable @@iterator
    const { password, role, ...userData } = response;
    console.log(password, role, userData);
    const accessToken = generateAccessToken(response._id, role);
    const refreshToken = generateRefreshToken(response._id, role);

    //Luư refresh token vào db
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      sucess: response ? true : false,
      accessToken,
      response,
    });
  } else {
    throw new Error("Invalid credentials !!!");
  }
});

// GET [api/currentToken]
const currentToken = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const userRes = await User.findById(_id).select(
    "-refreshToken -password -role"
  );
  // console.log(userRes);
  return res.status(200).json({
    success: true,
    res: userRes ? userRes : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  //Lấy token từ cookies
  const cookie = req.cookies;
  //Check xem có token hay không
  console.log(req.cookies);
  if (!cookie && !cookie.refreshToken) throw new Error("No refreshToken");
  // Check token có hợp lệ k
  // có lỗi thì thông báo lỗi luôn
  const rs = await jwt.verify((cookie.refreshToken, process.env.JWT_SECRET));
  const response = await User.findById({
    _id: decode._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken({ _id: response._id, role: response.role })
      : "Token access not matched",
  });

  //  jwt.verify(
  //    cookie.refreshToken,
  //    process.env.JWT_SECRET,

  //    async (err, decode) => {
  //      if (err) throw new Error("Invalid refresh token");
  //      // Check token có khớp vs token đã lưu trong db
  //      const response = await User.findById({
  //        _id: decode._id,
  //        refreshToken: cookie.refreshToken,
  //      });

  //      return res.status(200).json({
  //        success: response ? true : false,
  //        newAccessToken: response
  //          ? generateAccessToken({ _id: response._id, role: response.role })
  //          : "Refresh token Invalid",
  //      });
  //    }
  //  );
});

const logout = asyncHandler(async (req, res, next) => {
  //Lấy token từ cookies
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("Not refreshToken token in cookie");
  //Xóa refreshToken ở db
  await User.findOneAndUpdate(
    {
      refreshToken: cookie.refreshToken,
    },
    { refreshToken: "" },
    { new: true }
  );
  //Xóa refreshToken trình duyệt ng dùng
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout",
  });
});

module.exports = {
  register,
  login,
  currentToken,
  refreshAccessToken,
  logout,
};
