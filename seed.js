function seedRes(name,col,num)
{
  var target = db.getSiblingDB(name).getCollection(col);
  target.drop();

  var first = new Array("Good ", "Happy ", "Yummy ", "Delicious ", "Authentic ", "Cheap cheap ");
  var food = new Array("Fast food ", "Steak ", "Hotpot ", "Italian ", "Japanese ", "Thai ", "Spanish ", "French ", "Chinese ");
  var name = new Array("House ", "Restaurant ", "Cafe ", "Meal ", "Bar ");

  for(var i = 0; i < num; i++) 
  {
    var a = first[Math.floor(Math.random() * first.length)];
    var b = food[Math.floor(Math.random() * food.length)];
    var c = name[Math.floor(Math.random() * name.length)];
    var reportNum = 20+Math.floor(Math.random() * 80);
    var report = new Array();
    var randMultiplier = 5 + Math.floor(Math.random()*40);

    for(var j = 0; j < reportNum; j++)
    {
      var userID = 1+Math.floor(Math.random()*100);
      var reportTime = new Date();
      var randTime = Math.floor(Math.random()*30);

      report[j] = 
        {
          waiting_time : 1+Math.floor(Math.random()*randMultiplier),
          waiting_position : 1+Math.floor(Math.random()*randMultiplier/2),
          waiting_people: 1+Math.floor(Math.random()*6),
          user: 1+Math.floor(Math.random()*100),
          submit_time: new Date(reportTime.getTime() - randTime * 60000),
          user: userID,
        };
    }

    target.insert(
      {
        name: a+b+c+" "+Math.floor(Math.random()*10000),
        reports: report,
      });

  }
}

function seedUser(name,col,num)
{
  var target = db.getSiblingDB(name).getCollection(col);
  target.drop();

  for(var i = 0; i< num; i++)
  {
    target.insert(
      {
        name: "user_"+i,
        fbid: Math.floor(Math.random()*100000000000),
        point:100+Math.floor(Math.random()*100)*100
      });
  }
}

seedRes("app24572466", "restaurants", 100);
seedUser("app24572466", "users", 100);

