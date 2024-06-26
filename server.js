const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const checkRole = require("./middleware/checkRole");
const dotenv = require("dotenv").config();

connectDb();
const app = express();
// const path  = require("path");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
