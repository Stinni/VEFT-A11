// Assignment 11
// Student: Kristinn Heiðar Freysteinsson
// Email: kristinnf13@ru.is

const port = 4000;
const express = require("express");
const app     = express();

/*
/hello - GET
Returns the greeting 'Hello World'
*/
app.get("/api/hello", (req, res) => {
	res.status(200).send("Hello World");
});

app.listen(process.env.PORT || port, () => {
	console.log("Server starting on port " + port);
});
