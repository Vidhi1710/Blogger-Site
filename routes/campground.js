var express=require("express");
var router=express.Router();
var date = require('date-and-time');
var Campground=require("../models/campground.js");
var middleware=require("../middleware");

router.get("/",function(req,res){
	Campground.find({},function(err,all_campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:all_campgrounds,currentUser:req.user});
		}
	});
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.post("/",middleware.isLoggedIn, function(req,res){
	var cname= req.body.cname;
	var image=req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var now = new Date();	
	var newCampground={
		name: cname, image: image,description:description,author:author,date:now
	}
	Campground.create(newCampground,function(err,campground){
		if(err)
			console.log(err);
		else{
			// console.log(newCampground)
			res.redirect("/blogs");
		}
	});
})

router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,found_campground){
		if(err)
			console.log(err);
		else
			res.render("campgrounds/show",{campground:found_campground});
	})
});
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else
			res.render("campgrounds/edit",{campground:foundCampground});
	})
});
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else
			res.redirect("/blogs/"+req.params.id);
	})
});
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
});

module.exports=router;