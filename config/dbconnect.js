const { default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully");
  } catch (error) {
    console.log("db lỗi connect :");
    throw new Error(error);
  }
};

module.exports = dbConnect;
