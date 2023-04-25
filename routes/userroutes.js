const express = require("express");
const client = require("mongodb").MongoClient;
const routes = express.Router();
let dbinstance;

client.connect("mongodb://localhost:27017").then((db)=>{
    dbinstance = db.db("to-do");
}).catch((err)=>{
    console.log("in userroutes line 9");
})

routes.route("/").get((req, res)=>{
    dbinstance.collection("users").findOne({
        username: req.session.userid
    }, (err, result)=>{
        if(result) res.render("usermain/userpage", {user: result.username, tasks: JSON.parse(result.tasks)});
        else res.redirect("/login");
    })
});

routes.route("/").post((req, res)=>{
    dbinstance.collection('users').findOne({username: req.session.userid}, (err, result)=>{
        if(err) console.log("userroutes line 24");
        else{
            let updatedtasks = JSON.parse(result.tasks);
            let date = new Date();
            let task = {};
            task.id = date.getTime() +  date.getDay() + date.getDate() + date.getMonth() + date.getFullYear();
            task.title = req.body.title;
            task.body = req.body.body;
            task.status = "pending";
            updatedtasks.push(task);
            dbinstance.collection('users').updateOne({username: req.session.userid}, {$set : {tasks: JSON.stringify(updatedtasks)}});
        }
    })
    res.redirect("/");
})

routes.route("/get/:id").post((req, res)=>{
    dbinstance.collection("users").findOne({
        username: req.session.userid
    }, (err, result)=>{
        if(err) console.log("userroutes line 44");
        else{
            let taskarr = JSON.parse(result.tasks);
            taskarr.forEach((ele)=>{
                if(ele.id == req.params.id){
                    res.render("usermain/viewmore", {taskobj: ele});
                }
            })
        }
    })
})

routes.route("/update/:id").post((req, res)=>{
    dbinstance.collection("users").findOne({
        username: req.session.userid
    }, (err, result)=>{
        if(err) console.log("userroutes line 60");
        else{
            let taskarr = JSON.parse(result.tasks);
            taskarr.forEach((ele)=>{
                if(ele.id == req.params.id){
                    res.render("usermain/update", {taskobj: ele})
                }
            })
        }
    })
})

routes.route("/update").post((req, res)=>{
    dbinstance.collection("users").findOne({
        username: req.session.userid
    }, (err, result)=>{
        if(err) console.log("userroutes line 76");
        else{
            let taskarr = JSON.parse(result.tasks);
            taskarr.forEach((ele)=>{
                if(ele.id == req.body.id){
                    ele.title = req.body.title;
                    ele.body = req.body.body;
                }
            })
            dbinstance.collection("users").updateOne({username: req.session.userid}, {$set: {tasks: JSON.stringify(taskarr)}});
        }
    })
    res.redirect("/usermain");
})

routes.route("/delete/:id").post((req, res)=>{
    dbinstance.collection("users").findOne({
        username: req.session.userid
    }, (err, result)=>{
        if(err) console.log("userroutes line 94");
        else{
            let taskarr = JSON.parse(result.tasks);
            for(let i = 0; i<taskarr.length; i++){
                if(taskarr[i].id == req.params.id){
                    taskarr.splice(i, 1);
                    break;
                }
            }
            dbinstance.collection("users").updateOne({username: req.session.userid}, {$set: {tasks: JSON.stringify(taskarr)}});
        }
        res.redirect("/usermain");
    })
})

routes.route("/status/:id").get((req, res)=>{
    dbinstance.collection("users").findOne({
        username: req.session.userid
    }, (err, result)=>{
        if(err) console.log("userroutes line 94");
        else{
            let taskarr = JSON.parse(result.tasks);
            for(let i = 0; i<taskarr.length; i++){
                if(taskarr[i].id == req.params.id){
                    if(taskarr[i].status == "pending") taskarr[i].status = "completed";
                    else taskarr[i].status = "pending";
                    break;
                }
            }
            dbinstance.collection("users").updateOne({username: req.session.userid}, {$set: {tasks: JSON.stringify(taskarr)}});
        }
        res.redirect("/usermain");
    })
})

module.exports = routes;