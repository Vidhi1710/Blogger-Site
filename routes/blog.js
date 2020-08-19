var express=require("express");
var router=express.Router();
var date = require('date-and-time');
var Blog=require("../models/blog.js");
var User=require("../models/user.js");
var middleware=require("../middleware");

router.get("/search",function(req,res){
	var q=req.query.search;
	var allblog=[];
	Blog.find({
		name:{
			$regex: new RegExp(q), $options: 'si'
		}
	},function(err,data){
		data.forEach(function(one){
			allblog.push(one);
		})
		Blog.find({
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
			res.render("blogs/index",{blogs:allblog,s:q});
		});
	})
});



router.get("/",function(req,res){
	Blog.find({},function(err,all_blogs){
		if(err){
			console.log(err);
		}else{
			res.render("blogs/index",{blogs:all_blogs,currentUser:req.user,s:""});
		}
	});
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("blogs/new");
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
	var newBlog={
		name: cname, image: image,description:description,author:author,date:now
	}
	Blog.create(newBlog,function(err,blog){
		if(err)
			console.log(err);
		else{
			User.findById(blog.author.id,function(err,foundUser){
				if(err){
					console.log(err)
				}else{
					foundUser.posts.push(blog);
					foundUser.save();
					res.redirect("/blogs");
				}
			})
		}
	});
})

router.get("/:id", function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,found_blog){
		if(err)
			console.log(err);
		else
			res.render("blogs/show",{blog:found_blog});
	})
});
router.get("/:id/edit",middleware.checkBlogOwnership,function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else
			res.render("blogs/edit",{blog:foundBlog});
	})
});
router.put("/:id",middleware.checkBlogOwnership,function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else
			res.redirect("/blogs/"+req.params.id);
	})
});
router.delete("/:id",middleware.checkBlogOwnership,function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
});

module.exports=router;
