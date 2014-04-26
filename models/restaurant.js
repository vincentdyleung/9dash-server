module.exports = function(mongoose) {
	var collection = 'restaurants';
	var Schema = mongoose.Schema;

	var restaurantSchema = new Schema({
		name: String,
		reports: [{
			waiting_position: Number,
			waiting_time: Number,
			waiting_people: Number,
			submit_time: {type: Date, default: Date.now},
			user: String
		}],
		pictures: [{
			content: String,
			submit_time: Date,
			user: String
		}]
	});

	this.model = mongoose.model(collection, restaurantSchema);

	return this;
}
