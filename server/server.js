require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const PORT = process.env.LOCAL_PORT || 4600;

// Connect to MongoDB
connectDB();

//set the template engine
app.set("view engine", "ejs");

// custom middleware logger
app.use(logger);

// handle options credentials check - before CORS!
// and fetch cookies credentials  requirements
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));
// middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.resolve(__dirname, "public")));

// app.use("/", require("./routes/root"));

// ? PUBLIC ROUTES
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/refresh", require("./routes/refresh"));
app.use("/api/logout", require("./routes/logout"));
app.use("/api/public/inventory", require("./routes/publicAPI/pInventoryRoute"));
app.use("/api/public/request", require("./routes/publicAPI/pRequestRoute"));
// ! Require JWT Token to access data
// app.use(verifyJWT);
app.use("/api/inventory", require("./routes/api/inventoryRoute"));
app.use("/api/restock", require("./routes/api/restockRoute"));
app.use("/api/user", require("./routes/api/userRoute"));
app.use("/api/transaction", require("./routes/api/transactionRoute"));
app.use("/api/request", require("./routes/api/requestRoute"));
app.use("/api/inventory", require("./routes/api/inventoryRoute"));
app.use("/api/loginHistory", require("./routes/api/loginHistoryRoute"));
app.use(errorHandler);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "page", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
