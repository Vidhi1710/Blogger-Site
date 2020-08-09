var middlewareObj={},
	Campground=require("../models/campground"),
	Comment=require("../models/comment"),
	User=require("../models/user");
middlewareObj.checkCampgroundOwnership=function (req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You need to be logged in to do that");
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}
middlewareObj.checkUserOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		User.findById(req.params.user_id,function(err,foundUser){
			if(err){
				req.flash("error","User not found");
				res.redirect("back");
			}else{
				if(foundUser._id.equals(req.user._id)){
				   next();
				}else{
					req.flash("error","You need to be logged in to do that");
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}
middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
				   next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","You don't have permission to do that");
		res.redirect("back");
	}
}
middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

module.exports=middlewareObj;