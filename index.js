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

app.use(morgan("tiny"));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "public")));
// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, "../client/build"))); // Make sure this path is correct

//MOUNTING
app.use("/api/projects", projectRouter);
app.use("/api/courses", courseRouter);
app.use("/api/activity", activityRouter);
app.use("/api/email", emailRouter);
app.use("/api/users", userRouter);
// Route to serve the index.html file for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


//end MIDDLEWARE
connection(); //DB connection

app.listen(port , () => {
  console.log("listening on port " + port);
});
