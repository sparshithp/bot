var List = require('../models/List');
var History = require('../models/History');

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

exports.get = function(req, res) {
    var userId = req.user._id;
    List.findOne({userId: userId, status: "open"}, function(err, list){
        if(err){
            res.status(400).send({
                message: "error"
            });
        }else if (!list){
            list = new List({userId: userId});
            list.items = [];
            list.status = "open";
            list.save(function(err){
                res.status(200).send({
                    list: list
                });
            });
        }
        else{
            res.status(200).send({
                list: list
            });
        }
    });
};

exports.addItem = function(req, res) {
    var userId = req.user._id;
    var itemName = req.body.item;
    List.findOne({userId: userId, status:"open"}, function(err, list){
        if(err){
            res.status(400).send({
                message: "error"
            });
        }else{
            list.items.unshift({name: itemName});
            list.save(function(err){
                if(err){
                    res.status(400).send({
                        message: "error"
                    });
                }else{
                    res.status(200).send({
                        list: list
                    });
                }
            });
        }
    });
};

exports.deleteItem = function(req, res) {
    var userId = req.user._id;
    var itemId = req.body.itemId;
    List.findOne({userId: userId, status:"open"}, function(err, list){
        if(err){
            res.status(400).send({
                message: "error"
            });
        }else{
            var items = list.items;
            var indexToBeDeleted = -1;
            for(var i=0; i<items.length; i++) {
                if(items[i]._id == itemId){
                    indexToBeDeleted = i;
                }
            }
            if(indexToBeDeleted > -1){
                items.splice(indexToBeDeleted, 1);
            }
            console.log(list);
            list.save(function(err){
                if(err){
                    res.status(400).send({
                        message: "error"
                    });
                }else{
                    res.status(200).send({
                        list: list
                    });
                }
            });
        }
    });

};

exports.editItemById = function(req, res) {
    var userId = req.user._id;
    var itemId = req.body.itemId;
    var itemName = req.body.itemName;
    List.findOne({userId: userId}, function(err, list){
        if(err){
            res.status(400).send({
                message: "error"
            });
        }else{
            var items = list.items;
            for(var i=0; i<items.length; i++) {
                if(items[i]._id == itemId){
                    items[i].name = itemName;
                }
            }
            console.log(list);
            list.save(function(err){
                if(err){
                    res.status(400).send({
                        message: "error"
                    });
                }else{
                    res.status(200).send({
                        list: list
                    });
                }
            });
        }
    });
};

exports.checkout = function(req, res){
    var userId = req.user._id;
    List.findOne({userId: userId, status: "open"}, function(err, list){
        if(err){
            res.status(400).send({
                message: "error"
            });
        } else if(!list || !list.items || list.items.length == 0){
            res.status(200).send({
                success: false,
                message: "You dont have a shopping list"
            });
        } else {
            var successMsg = "Order has been placed. You will get your groceries within a couple of hours.";
            list.status = "placed";
            list.save(function(err){
                if(err){
                    res.status(400).send({
                        message: "error"
                    });
                }else{
                    res.status(200).send({
                        success: true,
                        message: successMsg
                    });
                    addCheckoutSuccessfulMessageToHistory(userId, successMsg);
                }
            })
        }
    });
};

function addCheckoutSuccessfulMessageToHistory(userId, successMsg){
    History.findOne({userId: userId}, function (err, history) {
        if (err) {
            console.log("error saving checkout message for user: " + userId);
        }
        if (!history) {
            history = new History({userId: userId});
            history.chats = [];
        }
        history.chats.push({
            response: true,
            text: successMsg
        });
        history.save(function(err){
            if(err) {
                console.log("error saving checkout message for user: " + userId);
            }
        });
    });

}

