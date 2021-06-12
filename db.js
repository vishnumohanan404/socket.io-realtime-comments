function dbConnect() {
  // db connection

  const mongoose = require("mongoose");
  const url = "mongodb://localhost/comments";

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("Database connected");
    })
    .catch(() => {
      console.log("Database connection falied");
    });
}

module.exports = dbConnect