const express = require('express');
const app = express();
const port = 8080;

app.get("/", (req, res) => {
    res.send("badobadi");
});

app.listen(port, () => {
    console.log("app is successfully connected");
});
