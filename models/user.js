module.exports = function(mongoose) {
	var collection = 'users';
	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		name: String,
    	fbid: String
	});
	
	this.model = mongoose.model(collection, userSchema);
	return this;	
}
