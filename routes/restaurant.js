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

module.exports.list.search = function(req, res) {	
	//Restaurant.find({name : new RegExp(req.params.name, 'i')})
  var reqID = req.params.id;
  console.log(reqID);
	Restaurant.findById(reqID)
		.exec( function(err, docs) {
			if (err) {
				res.json(500, { error: err });
			} else {
				//res.json(200, {count: docs.length, data: docs, req:req.params.id});
				res.json(200, docs);
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

module.exports.submitReport = function(req, res) {
	console.log(req.body);
	Restaurant.findById(req.params.id)
		.exec( function(err, restaurant) {
			if (err) {
				res.json(500, { error: err} );
			} else {
				var report = req.body;
				restaurant.reports.push(report);
				restaurant.save(function(err, restaurant, numAffected) {
					if (err) {
						res.json(500, { error: err} );
					} else {
						res.json(200, restaurant);
					}
				})
			}
		});
};