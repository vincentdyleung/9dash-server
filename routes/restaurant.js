var Restaurant;

module.exports = function(model) {
	Restaurant = model
}

module.exports.list = function(req, res) {	
	Restaurant.find()
		.exec( function(err, docs) {
			if (err) {
				res.json(500, { error: err });
			} else {
				res.json(200, {count: docs.length, data: docs });
			}
		});
};

module.exports.save = function(req, res) {
	var restaurant = new Restaurant(req.body);
	restaurant.save(function(err) {
		if (err) {
			res.json(500, { error: err });
		} else {
			res.json(200, restaurant);
		}
	});
};