var express=require("express");
var router=express.Router();
var date = require('date-and-time');
var Campground=require("../models/campground.js");
var User=require("../models/user.js");
var middleware=require("../middleware");

router.get("/search",function(req,res){
	var q=req.query.search;
	var allblog=[];
	Campground.find({
		name:{
			$regex: new RegExp(q), $options: 'si'
		}
	},function(err,data){
		data.forEach(function(one){
			allblog.push(one);
		})
		Campground.find({
			description:{
				$regex: new RegExp(q), $options: 'si'
			}
		},function(err,data2){
			data2.forEach(function(ne){
				var f=0
				allblog.forEach(function(check){
					if(check._id.equals(ne._id)){
						f=1;
					}
				})
				if(f==0){
					allblog.push(ne);	
				}
			})
			res.render("campgrounds/index",{campgrounds:allblog,s:q});
		});
	})
});



router.get("/",function(req,res){
	Campground.find({},function(err,all_campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:all_campgrounds,currentUser:req.user,s:""});
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
		fullname:req.user.fullname
	};
	var now = new Date();	
	var newCampground={
		name: cname, image: image,description:description,author:author,date:now
	}
	Campground.create(newCampground,function(err,campground){
		if(err)
			console.log(err);
		else{
			User.findById(campground.author.id,function(err,foundUser){
				if(err){
					console.log(err)
				}else{
					foundUser.posts.push(campground);
					foundUser.save();
					res.redirect("/blogs");
				}
			})
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
