const { default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    if (conn.connection.readyState === 1) console.log("Successfully");
    else console.log("lỗi connect");
  } catch (error) {
    console.log("db lỗi connect :");
    throw new Error(error);
  }
};

module.exports = dbConnect;
