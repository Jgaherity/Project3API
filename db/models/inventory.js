const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
mongoose.promise = Promise

// Define userSchema
const inventorySchema = new Schema({
	inventoryItemName: { type: String, unique: false },
    pickUpAddress: { type: String, unique: false },
    dropOffAddress: { type: String, unique: false },
	deliveryInstructions: { type: String, unique: false },
    isComplete: { type: Boolean , unique: false },
    tShirtSize: { type: String , unique: false }, //SM, M, L, XL


	// local: {
	// 	username: { type: String, unique: false, required: false },
	// 	password: { type: String, unique: false, required: false }
	// },
	// google: {
	// 	googleId: { type: String, required: false }
    // },
    

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
// inventorySchema.methods = {
// 	checkPassword: function(inputPassword) {
// 		return bcrypt.compareSync(inputPassword, this.local.password)
// 	},
// 	hashPassword: plainTextPassword => {
// 		return bcrypt.hashSync(plainTextPassword, 10)
// 	}
// }

// Define hooks for pre-saving
inventorySchema.pre('save', function(next) {
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
const Inventory = mongoose.model('Inventory', inventorySchema)
module.exports = Inventory
