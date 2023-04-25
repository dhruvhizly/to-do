const express = require("express");
const app = express();
const session = require("express-session");
const cookieparser = require("cookie-parser");
const loginroutes = require("./routes/loginroutes");
const userroutes = require("./routes/userroutes");
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieparser());
app.use(session({
    secret: "GHU%$yhgfk456wfRR^76e",
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge : 800000}
}))

app.use("/", (req, res, next)=>{
    if(req.session.userid || req.path === "/login" || req.path == "/login/signup" || req.path == "/login/forgot"){
        next();
    }
    else{
        res.redirect("/login");
    }
})

app.use("/login", loginroutes);
app.use("/usermain", userroutes);

app.get("/", (req, res)=>{
    res.redirect("/usermain");
})

app.get("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("/login");
})

app.listen(3000, (err)=>{
    if(err)
    console.log("server cannot be started !!!");
    else
    console.log("server started !!!");
})