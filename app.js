const mongoose = require('mongoose');
const users = require("./routes/api/users");
const photos = require("./routes/api/photos");
const express = require("express"); // initializes and creates server 
const app = express();

const bodyParser = require('body-parser'); // parse JSON 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/", (req, res) => res.send("Helloss World"));

const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use("/api/users", users);
app.use("/api/photos", photos); 