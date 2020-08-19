var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var middleware=require("../middleware");

router.get("/",function(req,res){
	res.render("landing");
});
router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username,fullname:req.body.fullname});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to BlogSite "+user.fullname)
			res.redirect("/blogs");
		});
	});
});

router.get("/login",function(req,res){
	res.render("login");
}) 
router.post("/login",passport.authenticate("local",{
	successRedirect:"/blogs",
	failureRedirect:"/login",
	failureFlash: true
}),function(req,res){
	
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/blogs");
});

router.get("/users/:user_id/changePassword",middleware.checkUserOwnership,function(req,res){
	User.findById(req.params.user_id,function(err,user){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("changePassword",{user:user});	
		}
	})
});
router.post("/users/:user_id",middleware.checkUserOwnership,function(req,res){
	User.findById(req.params.user_id,function(err,user){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			user.changePassword(req.body.oldPassword,req.body.newPassword,function(err){
				if(err){
					console.log(err);
				}else{
					console.log("updated successfully")
				}
			})
		}
	})
})

module.exports=router;