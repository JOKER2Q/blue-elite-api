const mongoose = require("mongoose");
const DB = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);
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
