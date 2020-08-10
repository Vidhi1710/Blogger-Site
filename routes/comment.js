var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground.js");
var Comment=require("../models/comment.js");
var middleware=require("../middleware");
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			console.log(err);
		else
			res.render("comments/new",{campground:campground});
	})
	
})
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			req.flash("error","Something went wrong");
			res.redirect("/blogs");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					console.log(err);
				else{
					// console.log(req.user.username);
					comment.author.id=req.user._id;
					comment.author.fullname=req.user.fullname;
					var today = new Date();
					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
					var yyyy = today.getFullYear();

					today = dd + '/' + mm + '/' + yyyy;
					comment.date=today;
					comment.save();
					// console.log(comment);
					campground.comments.push(comment);
					// console.log(campground);
					campground.save();
					req.flash("success","Successfully created comment");
					res.redirect('/blogs/'+campground._id);
				}
			})
		}
	})
});
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campgroundId:req.params.id,comment:foundComment});
		}
	})
});
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted")
			res.redirect("/blogs/"+req.params.id);
		}
	})
});

module.exports=router;

