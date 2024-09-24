require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connection = require("./db");
const projectRouter = require("./routes/projectRouter");
const courseRouter = require("./routes/courseRouter");
const activityRouter = require("./routes/activityRouter");
const emailRouter = require("./routes/emailRouter");
//MIDDLEWARES
app.use(cors()); // This allows all origins

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("tiny"));
app.use(bodyParser.json()); // Parse JSON bodies

//end MIDDLEWARE
connection(); //DB connection
//MOUNTING
app.use("/api/projects", projectRouter);
app.use("/api/courses", courseRouter);
app.use("/api/activity", activityRouter);
app.use("/api/email", emailRouter);
app.use("/api/users", userRouter);

app.listen(8000, () => {
  console.log("listening on port " + port);
});
