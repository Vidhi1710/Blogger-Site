var middlewareObj={},
	Blog=require("../models/blog"),
	Comment=require("../models/comment"),
	User=require("../models/user");
middlewareObj.checkBlogOwnership=function (req,res,next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id,function(err,foundBlog){
			if(err){
				req.flash("error","Blog not found");
				res.redirect("back");
			}else{
				if(foundBlog.author.id.equals(req.user._id)){
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