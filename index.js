// Assignment 11
// Student: Kristinn Heiðar Freysteinsson
// Email: kristinnf13@ru.is

const express    = require("express");
const bodyParser = require("body-parser");

const app = express();
// only accept json body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
/hello - GET
Returns the greeting 'Hello World'
*/
app.get("/hello", (req, res) => {
	res.code(200).send("Hello World");
});

app.listen(process.env.PORT || 5000);
