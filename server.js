// Loading evnironmental variables here
if (process.env.NODE_ENV !== 'production') {
	console.log('loading dev environments')
	require('dotenv').config()
}
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const router = express.Router()
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const dbConnection = require('./db') // loads our connection to the mongo database
const User = require("./db/models/user")
const Driver = require("./db/models/driver")
const Inventory = require("./db/models/inventory")
const passport = require('./passport')
const app = express()
const PORT = process.env.PORT || 3001


var cors = require('cors');
const mongoose = require('mongoose');

// Middleware necessary for front end to talk to backend
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
}));

// ===== Middleware ====
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())
app.use(
	session({
		secret: process.env.APP_SECRET || 'this is the default passphrase',
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false,
		saveUninitialized: false
	})
)

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

// ===== Passport ====
app.use(passport.initialize())
app.use(passport.session()) // will call the deserializeUser

// ===== testing middleware =====
//this is working
app.use(function(req, res, next) {
	// console.log('===== passport user =======')
	// console.log(req.session)
	// console.log(req.user)
	// console.log('===== END =======')
	next()
})
// testing
app.get(
	'/auth/google/callback',
	(req, res, next) => {
		console.log(`req.user: ${req.user}`)
		console.log('======= /auth/google/callback was called! =====')
		next()
	},
	// passport.authenticate('google', { failureRedirect: '/login' }),
	// (req, res) => {
	// 	res.redirect('/')
	// }
)

app.get('/users', (req, res, next) => {
	// console.log('===== user!!======')
	// console.log(req.User)

	// if (req.User) {
	// 	return res.json({ user: req.User })
	// } else {
	// 	return res.json({ User: null })
	// }

	User.find({}, function(error, results) {
		// Show any errors
		if (error) {
		  console.log(error);
		}
		else {
		  console.log(results)
		  // Otherwise, send the books we found to the browser as a json
		  res.json(results);
		}
	  });

	//res.json("hello")
})

app.get('/drivers', (req, res, next) => {
	// console.log('===== user!!======')
	// console.log(req.User)

	// if (req.User) {
	// 	return res.json({ user: req.User })
	// } else {
	// 	return res.json({ User: null })
	// }

	Driver.find({}, function(error, results) {
		// Show any errors
		if (error) {
		  console.log(error);
		}
		else {
		  console.log(results)
		  // Otherwise, send the books we found to the browser as a json
		  res.json(results);
		}
	  });

	//res.json("hello")
})

app.get('/inventory', (req, res, next) => {
	// console.log('===== user!!======')
	// console.log(req.User)


	Inventory.find({}, function(error, results) {
		// Show any errors
		if (error) {
		  console.log(error);
		}
		else {
		  console.log(results)
		  // Otherwise, send the books we found to the browser as a json
		  res.json(results);
		}
	  });

	//res.json("hello")
})

app.post("/submitInventory", function(req, res) {
	// Save the request body as an object called book
	var newParcel = req.body;
	//res.json(newParcel);
	console.log(newParcel);
	console.log("SUCCCESS");
	//check distances here-----
  
	Inventory.create(newParcel, function(error, saved) {
	  // Show any errors
	  if (error) {
		console.log(error);
	  }
	  else {
		// Otherwise, send the response to the client (for AJAX success function)
		res.send(saved);
		//console.log("Saved:", newParcel);

		//ANOTHER QUERY	
		//grab all drivers

		Driver.find({ }, function(error, found) {
			// Show any errors
			if (error) {
			  console.log(error);
			}
			else {
				console.log(found)
				res.json(found);
				//inside callback: do math with the google API 
			}
		  });
	
	  }
	});


  });

app.post("/git", function(req, res) {
	// Save the request body as an object called book
	var newUser = req.body;
	//res.json(newUser);
	console.log(newUser);
	console.log("SUCCCESS");
	//check distances here-----
	
	User.create(newUser, function(error, saved) {
		// Show any errors
		if (error) {
			console.log(error);
		}
		else {
		// Otherwise, send the response to the client (for AJAX success function)
		res.send(saved);
		//console.log("Saved:", newParcel);

		//ANOTHER QUERY	
		//grab all drivers

		User.find({ }, function(error, found) {
			// Show any errors
			if (error) {
				console.log(error);
			}
			else {
				console.log(found)
				res.json(found);
				//inside callback: do math with the google API 
			}
			});
		}
	});
});
	

app.get('/',
	(req, res, next) => {
		// console.log(`req.user: ${req.user}`)
		// console.log('======= /auth/google/callback was called! =====')
		// next()
		res.json("hello")
	}
	// passport.authenticate('google', { failureRedirect: '/login' }),
	// (req, res) => {
	// 	res.redirect('/')
	// }
)

// ==== if its production environment!
if (process.env.NODE_ENV === 'production') {
	const path = require('path')
	console.log('YOU ARE IN THE PRODUCTION ENV')
	app.use('/static', express.static(path.join(__dirname, './client/build/static')))
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, './client/build/'))
	})
}

/* Express app ROUTING */
app.use('/api', require('./auth'))

// ====== Error handler ====
app.use(function(err, req, res, next) {
	console.log('====== ERROR =======')
	console.error(err.stack)
	res.status(500)
``})

// ==== Starting Server =====
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
});


//**** Populating data 

// Connect to the MongoDB
// mongoose.connect("mongodb://localhost/schemaexample", { useNewUrlParser: true });

// Create an object containing dummy data to save to the database
var driver = {
  array: ["driver1", "driver2", "driver3"],
  string: []
  //   "\"Don't worry if it doesn't work right. If everything did, you'd be out of a job\" - Mosher's Law of Software Engineering",
};

var user = {
    array: ["sender1", "sender2", "sender3"],
    string: []
    //   "\"Don't worry if it doesn't work right. If everything did, you'd be out of a job\" - Mosher's Law of Software Engineering",
  };

  var inventory = {
    array: ["package1", "package2", "package3"],
    string: []
    //   "\"Don't worry if it doesn't work right. If everything did, you'd be out of a job\" - Mosher's Law of Software Engineering",
	};
	


// app.get("/test-user", function(req, res) {
// User.create(
// 	  {
// 		fullName: "Jackie",
// 		homeAddress: "1201 S Madison St, Seattle, WA 98021",
// 		phoneNumber: "425-333-5678",
// 		email: "jackie@jackie.com",
// 		// local: [
// 		// 	username: "jackie",
// 		// 	password: "jackie",
// 		// ],
// 		// google: [
// 		// 	googleId: "jakcie",
// 		// ]
// 	},
// 	{
// 		fullName: "Max",
// 		homeAddress: "1799 Fourth Street, Berkeley, CA 94710",
// 		phoneNumber: "425-333-5678",
// 		email: "max@max.com",
// 	},
// 	{
// 		fullName: "Lewis",
// 		homeAddress: "1799 Fourth Street, Berkeley, CA 94710",
// 		phoneNumber: "425-333-5678",
// 		email: "lewis@lewis.com",
// 	},
// 	function(error, data) {
// 		if (error) throw error;
// 		console.log(data)
// 	}
// )

  
// Driver.create(
// 	{
// 	  fullName: "Vanita",
// 	  homeAddress: "1221 1st Avenue, Seattle, WA 98101",
// 	  phoneNumber: "425-123-1231",
// 	  email: "vanita2716@gmail.com",
// 	  // local: [
// 	  // 	username: "jackie",
// 	  // 	password: "jackie",
// 	  // ],
// 	  // google: [
// 	  // 	googleId: "jakcie",
// 	  // ]
// 	},
// 	{
// 	  fullName: "Bobby",
// 	  homeAddress: "2623 NE University Village Street, Seattle, WA 98105",
// 	  phoneNumber: "425-123-1231",
// 	  email: "bobby@gmail.com",
// 	  // local: [
// 	  // 	username: "jackie",
// 	  // 	password: "jackie",
// 	  // ],
// 	  // google: [
// 	  // 	googleId: "jakcie",
// 	  // ]
// 	},
	
// 	function(error, data) {
// 		if (error) throw error;
// 		console.log(data)
// 	}
// );

// Inventory.create( 
	
// {inventoryItemName: "Mom's Present",
// pickUpAddress: "22020 17th Avenue Southeast, Bothell, WA 98021",
// dropOffAddress: "901 Boren Ave, Seattle, WA 98104",
// deliveryInstructions: "Please drop off to the 14th Floor",
// isComplete: "true",
// tShirtSize: "L",
// },
	
// {inventoryItemName: "Dad's Present",
// pickUpAddress: "21714 43rd Drive Southeast, Bothell, WA 98021",
// dropOffAddress: "1221 1st Ave, Seattle, WA 98101",
// deliveryInstructions: "Please drop off to the 16th Floor",
// isComplete: "true",
// tShirtSize: "M",
// },

// {inventoryItemName: "Valentine's Present",
// pickUpAddress: "6901 Sand Point Way Northeast, Seattle, WA 98115",
// dropOffAddress: "22102 54th Ave W, Mountlake Terrace, WA 98043",
// deliveryInstructions: "Please drop off at the front door",
// isComplete: "false",
// tShirtSize: "M",
// },

// 	function(error, data) {
// 		if (error) throw error;
// 		console.log(data)
// 	}



// );

 // Save a new Example using the data object
// db.create.User(data)
//   .then(function(dbUser) {
//     // If saved successfully, print the new Example document to the console
//     console.log(dbUser);
//   })
//   .catch(function(err) {
//     // If an error occurs, log the error message
//     console.log(err.message);
//   });



// this route is just used to get the user basic info