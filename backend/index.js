const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const { connectDB } = require("./database/database");
const useragent = require("express-useragent");
const path = require("path");

const app = express();
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads", "profiles"))
);

// Connect to the database
connectDB();

// Start the server using the HTTP server with Socket.IO
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});