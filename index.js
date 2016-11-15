// Assignment 7, weeks 8-9
// Student: Kristinn Heiðar Freysteinsson
// Email: kristinnf13@ru.is

const express    = require("express");
const bodyParser = require("body-parser");
const datetime   = require("node-datetime");

class Company {
	constructor(id, name, punchCount) {
		this.id = id;
		this.name = name;
		this.punchCount = punchCount;
	}
}

class User {
	constructor(id, name, email) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.punches = [];
	}
}

class Punch {
	constructor(cId) {
		this.cId = cId;
		this.created = datetime.create().format("d/m/y H:M:S");
	}
}

const app = express();
// only accept json body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// I like having some data here while I'm working/testing :)
const companies = [ new Company(0, "Forvit", 10), new Company (1, "Smuuu", 20) ];
const users = [ new User(0, "Kristinn", "kristinnf13@ru.is"), new User(1, "Daníel", "dabs@ru.is") ];
users[0].punches.push(new Punch(0));
users[1].punches.push(new Punch(1));

/*
(10%) /api/companies - GET
Returns a list of all registered companies
*/
app.get("/api/companies", (req, res) => {
	res.json(companies);
});

/*
(10%) /api/companies - POST
Adds a new company. The required properties are "name" and "punchCount", indicating how many punches
a user needs to collect in order to get a discount.
*/
app.post("/api/companies", (req, res) => {
	if(!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("punchCount")) {
		res.statusCode = 400;
		return res.send("Error. Post syntax incorrect!");
	}

	var name = req.body.name;

	if(name == "" || name == null) {
		res.statusCode = 400;
		return res.send("Error. Company name has to be included!");
	}

	var pCount = parseInt(req.body.punchCount);

	if(isNaN(pCount) || pCount <= 0) {
		res.statusCode = 400;
		return res.send("Error. '" + req.body.punchCount + "' is not a valid punchCount!");
	}

	var newCompany = new Company(companies.length, name, pCount);
	companies.push(newCompany);

	res.statusCode = 200;
	res.json(newCompany);
});

/*
(10%) /api/companies/{id} - GET
Returns a given company by id.
*/
app.get("/api/companies/:id", (req, res) => {
	var id = parseInt(req.params.id);
	if(isNaN(id) || id >= companies.length || id < 0) {
		res.statusCode = 404;
		return res.send("Error. '" + req.params.id + "' is not a valid company id!");
	}
	res.json(companies[id]);
});

/*
(10%) /api/users/ - GET
Returns a list of all users
*/
app.get("/api/users", (req, res) => {
	res.json(users);
});

/*
(20%) /api/users/ - POST
Adds a new user to the system. The following properties must be specified: name, email
*/
app.post("/api/users", (req, res) => {
	if(!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("email")) {
		res.statusCode = 400;
		return res.send("Error. Post syntax incorrect!");
	}

	var name = req.body.name;
	if(name == "" || name == null) {
		res.statusCode = 400;
		return res.send("Error. The user's name has to be included!");
	}

	var email = req.body.email;
	if(email == "" || email == null) {
		res.statusCode = 400;
		return res.send("Error. The user's email has to be included!");
	}

	var newUser = new User(users.length, name, email);
	users.push(newUser);

	res.statusCode = 200;
	res.json(newUser);
});

/*
This method is not a part of the project. I added this to check if punches/punchtimes were correct
before I started working on the rest of the methods.
*/
app.get("/api/users/:id", (req, res) => {
	var id = parseInt(req.params.id);
	if(isNaN(id) || id >= users.length || id < 0) {
		res.statusCode = 404;
		return res.send("Error. '" + req.params.id + "' is not a valid user id!");
	}
	res.json(users[id]);
});

/*
(20%) /api/users/{id}/punches - GET
Returns a list of all punches registered for the given user. Each punch contains information about what
company it was added to, and when it was created. It should be possible to filter the list by adding a
"?company={id}" to the query.
*/
app.get("/api/users/:id/punches", (req, res) => {
	var pId = parseInt(req.params.id);
	if(isNaN(pId) || pId >= users.length || pId < 0) {
		res.statusCode = 404;
		return res.send("Error. '" + req.params.id + "' is not a valid user id!");
	}

	if(!req.query.company) {
		if(users[pId].punches.length <= 0) {
			res.statusCode = 404;
			return res.send("User '" + pId + "' has no punches.");
		}
		return res.json(users[pId].punches);
	}

	var cId = parseInt(req.query.company);
	if(isNaN(cId) || cId >= companies.length || cId < 0) {
		res.statusCode = 404;
		return res.send("Error. '" + req.query.company + "' is not a valid company id!");
	}

	var pList = [];
	for(var i = 0; i < users[pId].punches.length; i++) {
		if(users[pId].punches[i].cId == cId) {
			pList.push(users[pId].punches[i]);
		}
	}

	if(pList.length <= 0) {
		res.statusCode = 404;
		return res.send("User '" + pId + "' has no punches at company '" + cId + "'");
	}

	res.json(pList);
});

/*
(20%) /api/users/{id}/punches - POST
Adds a new punch to the user account. The only information needed is the id of the company.
*/
app.post("/api/users/:id/punches", (req, res) => {
	var pId = parseInt(req.params.id);
	if(isNaN(pId) || pId >= users.length || pId < 0) {
		res.statusCode = 404;
		return res.send("Error. '" + req.params.id + "' is not a valid user id!");
	}

	if(!req.body.hasOwnProperty("cId")) {
		res.statusCode = 400;
		return res.send("Error. Post syntax incorrect!");
	}

	var cId = parseInt(req.body.cId);
	if(isNaN(cId) || cId >= companies.length || cId < 0) {
		res.statusCode = 404;
		return res.send("Error. '" + req.body.cId + "' is not a valid company id!");
	}

	var newPunch = new Punch(cId);
	users[pId].punches.push(newPunch);

	res.statusCode = 200;
	res.json(newPunch);
});

app.listen(process.env.PORT || 5000);
