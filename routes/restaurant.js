var fs = require("fs");
var gm = require("gm");

var Restaurant;
var User;

function interpret(reports)
{
  if(reports == undefined)
    return undefined;
  var ret = new Object();
  ret.allWT = ret.allWTC = ret.allWP = ret.allWPC = 0;
  ret.oneWT = ret.oneWTC = ret.oneWP = ret.oneWPC = 0;
  ret.threeWT = ret.threeWTC = ret.threeWP = ret.threeWPC = 0;
  ret.fiveWT = ret.fiveWTC = ret.fiveWP = ret.fiveWPC = 0;
  reports.forEach(function(entry)
  {
    if( entry.waiting_time != undefined)
    {
      ret.allWT += entry.waiting_time;
      ret.allWTC += 1;
    }
    if( entry.waiting_position!= undefined)
    {
      ret.allWP += entry.waiting_position;
      ret.allWPC += 1;
    }
    if( entry.waiting_time != undefined &&  entry.waiting_people > 4)
    {
      ret.fiveWT += entry.waiting_time;
      ret.fiveWTC += 1;
    }
    if( entry.waiting_position != undefined && entry.waiting_people > 4)
    {
      ret.fiveWP += entry.waiting_position;
      ret.fiveWPC += 1;
    }
    if( entry.waiting_time != undefined && entry.waiting_people < 5 && entry.waiting_people > 2)
    {
      ret.threeWT += entry.waiting_time;
      ret.threeWTC += 1;
    }
    if( entry.waiting_position != undefined && entry.waiting_people < 5 && entry.waiting_people > 2)
    {
      ret.threeWP += entry.waiting_position;
      ret.threeWPC += 1;
    }
    if( entry.waiting_time != undefined && entry.waiting_people < 3 && entry.waiting_people > 0)
    {
      ret.oneWT += entry.waiting_time;
      ret.oneWTC += 1;
    }
    if( entry.waiting_position != undefined && entry.waiting_people < 3 && entry.waiting_people > 0)
    {
      ret.oneWP += entry.waiting_position;
      ret.oneWPC += 1;
    }
  });
  ret.allWT /= ret.allWTC;
  ret.allWP /= ret.allWPC;
  ret.fiveWT /= ret.fiveWTC;
  ret.fiveWP /= ret.fiveWPC;
  ret.threeWT /= ret.threeWTC;
  ret.threeWP /= ret.threeWPC;
  ret.oneWT /= ret.oneWTC;
  ret.oneWP /= ret.oneWPC;
  return ret;
}

module.exports = function(model, modelU) {
	Restaurant = model;
  User = modelU;
}

module.exports.list = function(req, res) 
{	
  var ret = new Array();
  var currTime = new Date();
  Restaurant.find({"reports.submit_time" : { $gte : currTime.getTime() - 60*60000 }})
    .limit(25)
    .exec(function(err,docs){
      if(err) res.json(500, {error:err});
      else{
        docs.forEach(function(doc)
          {
            var newObj = 
              {
                name:doc.name,
                id:doc.id,
                time:interpret(doc.reports),
                photo: doc.pictures.sort(function(a,b) {return dates.compare(a,b);})[0]
              };
            ret.push(newObj);
          });
        res.json(200,ret);
      }
    });
};

module.exports.list.search = function(req, res) {	
	//Restaurant.find({name : new RegExp(req.params.name, 'i')})
  var reqID = req.params.id;
  var reqName = req.params.name;
  //console.log(reqID);
  //console.log(reqName);
  if(reqID != undefined)
  {
    var currTime = new Date();
    Restaurant.findById(reqID)
      .where("reports.submit_time").gt( currTime.getTime() - 60* 60000)  
      .exec( function(err, docs) {
        if (err) {
          res.json(500, { error: err });
        } else {
          //res.json(200, {count: docs.length, data: docs, req:req.params.id});
          var ret = 
            { 
              name: docs.name, 
              id: docs.id, 
              time: interpret(docs.reports), 
              photo: docs.pictures.sort(function(a,b){return dates.compare(a,b);})[0]
            }; 
      //console.log(ret);
          res.json(200, ret);
        }
      });
  }
  else if(reqName != undefined)
  {
    var ret = new Array();
    var currTime = new Date();
    Restaurant.find({ name : new RegExp(reqName, 'i') , "reports.submit_time" : {$gte : currTime.getTime() - 60 * 60000}})
      //.where("reports.submit_time").gt( currTime.getTime() - 6000* 60000)  
      .exec( function(err, docs) {
        if (err) {
          res.json(500, { error: err });
        } else {
          //res.json(200, {count: docs.length, data: docs, req:req.params.id});
          docs.forEach(function(doc)
            {
              //console.log(doc);
              var newObj = 
                { 
                  name : doc.name, 
                  id: doc.id , 
                  time: interpret(doc.reports),
                  photo: doc.pictures.sort(function(a,b){return dates.compare(a,b);})[0]
                };
              //ret.push(interpret(doc.reports) ); 
              ret.push(newObj ); 
            });
          //console.log(ret);
          res.json(200, ret);
        }
      });
  }
};

module.exports.save = function(req, res) {
  var restaurant = new Restaurant(req.body);
	restaurant.save(function(err) {
		if (err) { res.json(500, { error: err }); } 
    else {
			res.json(200, restaurant);
		}
	});
};

module.exports.submitPhoto = function(req, res) {
  var reqID = req.params.id;
  var info = req.body;
  //console.log(req.header('Content-Type'));
  //console.log(req.body);
  Restaurant.findById(reqID).exec(function(err, rest)
  {
    if(err) { res.json(500, {error:err}); }
    else
    {
      console.log("OKFFF");
      rest.pictures.push(
        {
          content: req.body.img,
          submit_time: new Date(),
          user : req.body.user,
        });
      rest.save(function(err, restaurant, numAffected)
        {
          if(err) { res.json(500, {error:err} ); }
          else 
          {
            User.findById(req.body.user).exec(function(err,doc){ doc.point += 700; doc.save(function(err){ res.json(500,err)});});
            res.json(200, {ok:"OK"});
          }
        });
      //console.log(info);
      //fs.writeFile("/home/sam/code/ust/9dash-server/public/uploads/a.jpg", new Buffer(req.body.img, "base64"), function(err){ console.log(err); });
    }
  });
};

module.exports.submitReport = function(req, res) {
  console.log("AAA");
	console.log(req.body);
  console.log(req.params.id);
	Restaurant.findById(req.params.id)
		.exec( function(err, restaurant) {
			if (err) {
				res.json(500, { error: err} );
			} else {
				restaurant.reports.push(
          {
            waiting_position : req.body.pos,
            waiting_time : req.body.time,
            waiting_people : req.body.ppl,
            submit_time : new Date(),
            user : req.body.user,
          });
				restaurant.save(function(err, restaurant, numAffected) {
					if (err) {
						res.json(500, { error: err} );
					} else {
            User.findById(req.body.user).exec(function(err,doc){ doc.point += 1100; doc.save(function(err){ res.json(500,err)});});
						res.json(200, {OK:"OK"});
					}
				})
			}
		});
};
