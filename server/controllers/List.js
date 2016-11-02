var List = require('../models/List');

exports.add = function(req, res) {
   // req.user._id ="123";
   // var userId = req.user._id;
    console.log("here");
    console.log(req.body);
    var userId = req.user._id;
    var items = req.body.items;
    var list = new List();
    list.userId = userId;
    var itemList = [];
    for(var i=0; i<items.length; i++){
        itemList.push({name: items[i]});
    }
    list.items = itemList;
    list.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send("Error");
        } else {
        console.log("*****Success");
            res.status(200).send("Added");
        }
    });
};

