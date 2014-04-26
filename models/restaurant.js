module.exports = function(mongoose) {
	var collection = 'restaurants';
	var Schema = mongoose.Schema;

	var restaurantSchema = new Schema({
		name: String,
		reports: [{
			current_ticket_number: Number,
			last_ticket_number: Number,
			submit_time: Date,
			user: Schema.Types.ObjectId
		}],
		pictures: [{
			url: String,
			submit_time: Date,
			user: Schema.Types.ObjectId
		}]
	});

	this.model = mongoose.model(collection, restaurantSchema);

	return this;
}
