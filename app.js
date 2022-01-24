//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema = new mongoose.Schema({
	email:String,
	password:String
});

console.log(process.env.API_KEY);
secret = process.env.SECRET;

userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});


const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
	res.render("home");
});

app.get("/login",function(req,res){
	res.render("login");
});

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	const em = req.body.username;
	const pass = req.body.password;
	const newUser = new User({
		email:em,
		password:pass
	});
	newUser.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			res.render("secrets");
		}
	});
});


app.post("/login",function(req,res){
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({email:username},function(err,foundUser){
		if(err){
			console.log(err);
		}
		if(foundUser){
			if(foundUser.password==password){
				res.render("secrets");
			}
			else{
				res.send("Incorrect Password");
			}
		}
		else{
			res.send("User Not Found");
		}
	});
})

app.listen(3000,function(){
	console.log("3000 port running");
});