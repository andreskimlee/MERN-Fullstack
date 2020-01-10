const express = require("express"); // initializes and creates server 
const app = express();

app.get("/", (req, res) => res.send("Hello World"));

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server is running on port ${port}`));


