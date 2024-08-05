require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const cors = require("cors")
const app = express();
app.use(bodyParser.json());

app.use(cors())

const mongo_db_url = process.env.MONGODB_URL;

mongoose.connect(mongo_db_url, {

})
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database not connected", err))
const PORT = process.env.PORT || 5000;
app.use('/api', require('./routes/auth'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
