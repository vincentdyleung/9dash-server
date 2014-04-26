var User;

module.exports = function(model) {
	User = model;
};

/* GET users listing. */
module.exports.list = function(req, res){
	User.find()
		.exec( function( err, docs ) {
			if (err) {
				res.json(500, { error: err });
			} else {
				res.json(200, { count: docs.length, data: docs });
			}
		});
};

module.exports.find = function(req, res) {
	var fbId = req.params.fbId;
	User.find( { fbid: fbId })
		.exec( function( err, docs ) {
			if (err) {
				res.json(500, { error: err });
			} else {
				res.json(200, { count: docs.length, data: docs });
			}
		});
}


module.exports.save = function(req, res) {
	var user = new User(req.body);
	user.save(function(err) {
		if (err) {
			res.json(50, { error: err });
		} else {
			res.json(200, user);
		}
	})
}
