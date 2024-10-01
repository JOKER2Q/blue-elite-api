const mongoose = require("mongoose");
const DB = "mongodb://localhost:27017/blueElite";
module.exports = async function connection() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(DB, connectionParams);
    console.log("DB CONECTION");
  } catch (err) {
    console.log(err);
  }
};
  