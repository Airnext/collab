var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs');
	
var UserSchema = new Schema({
	name:{type:String},
	password:{type:String},
	email:{type:String},
	biography:{type:String},
	dateCreated:{type:Date, 'default':Date.now}
});

UserSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.checkPassword = function(guesspassword){
	return bcrypt.compareSync(guesspassword, this.password);
};

module.exports = mongoose.model('user', UserSchema);