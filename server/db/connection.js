// SETTING THE CONNECTION TO MONGODB
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

// mongo clound connection url
// const CONNECTION_URL =
//   "mongodb+srv://rahulsg1:Rahul@123@cluster0.wqmoi.mongodb.net/urban-services?retryWrites=true&w=majority";

// CONNECTING TO MONGO CLOUD
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`database connected on port: http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.log(`${err} did not connect`);
  });
