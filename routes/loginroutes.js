const express = require("express");
const routes = express.Router();
const client = require("mongodb").MongoClient;
let dbinstance;
client.connect("mongodb://localhost:27017").then((db) => {
    dbinstance = db.db("to-do");
    console.log("db connected");
}).catch((err) => {
    console.log(err);
}) 

routes.route("/").get((req, res) => {
    res.render("login/loginpage", { err: "" });
});

routes.route("/").post((req, res) => {

    let filter = {
        "username": req.body.username,
        "password": req.body.password
    }

    dbinstance.collection("users").findOne(filter).then((result) => {
        if (result) {
            req.session.userid = req.body.username;
            req.session.id = result._id;
            res.redirect("/usermain");
        }
        else {
            res.render("login/loginpage", { err: "Incorrect Username or Password !!!" });
        }
    }).catch(() => {
        console.log("Error near line 33");
    })
})

routes.route("/signup").get((req, res) => {
    res.render("login/signup", { err: "" });
})

routes.route("/signup").post((req, res) => {
    dbinstance.collection("users").find({}).toArray((err, result) => {
        let flag = 1;
        for (let i = 0; i < result.length; i++) {
            if (result[i].username == req.body.username) {
                flag = 0;
                res.render("login/loginpage", { err: "User already exists!!!" });
            }
        }
        if (flag == 1) {
            dbinstance.collection("users").insertOne(
                {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    tasks: JSON.stringify([])
                }
            );
            res.redirect("/login");
        }
    });
});

routes.route("/forgot").get((req, res) => {
    
})

module.exports = routes;