const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
mongoose.promise = Promise

// Define driverSchema
const driverSchema = new Schema({
	fullName: { type: String, unique: false },
	homeAddress: { type: String, unique: false },
	phoneNumber: { type: String, unique: false },
	email: { type: String, unique: false },
	//how to do inventory? 
    // inventory : {},
	local: {
		username: { type: String, unique: false, required: false },
		password: { type: String, unique: false, required: false }
	},
	google: {
		googleId: { type: String, required: false }
	},
	// local: {
	// 	email: { type: String, unique: true },
	// 	password: { type: String }
	// },
	// google: {
	// 	id: { type: String },
	// 	photos: []
	// },
	// firstName: { type: String },
	// lastName: { type: String }
})

// Define schema methods
driverSchema.methods = {
	checkPassword: function(inputPassword) {
		return bcrypt.compareSync(inputPassword, this.local.password)
	},
	hashPassword: plainTextPassword => {
		return bcrypt.hashSync(plainTextPassword, 10)
	}
}

// Define hooks for pre-saving
driverSchema.pre('save', function(next) {
	if (!this.local.password) {
		console.log('=======NO PASSWORD PROVIDED=======')
		next()
	} else {
		this.local.password = this.hashPassword(this.local.password)
		next()
	}
	// this.password = this.hashPassword(this.password)
	// next()
})

// Create reference to User & export
const Driver = mongoose.model('driver', driverSchema)
module.exports = Driver
