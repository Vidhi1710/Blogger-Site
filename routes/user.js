var express=require("express");
var router=express.Router();
var User=require("../models/user");
var middleware=require("../middleware");

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dxxdezndr', 
  api_key: '513773353758877', 
  api_secret: 'vlP5smK6IjpfMNMtQPVTK-K3SZk'
});


router.get("/:user_id",function(req,res){
	User.findById(req.params.user_id).populate("posts").exec(function(err,foundUser){
		if(err){
			console.log(err);
			res.send("User Not Found!");
		}else{
			res.render("users/show",{user:foundUser});	
		}
	})
})
 
router.get("/:user_id/edit",middleware.checkUserOwnership,function(req,res){
	User.findById(req.params.user_id,function(err,foundUser){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("users/edit",{user:foundUser});	
		}
	})	
});

router.put("/:user_id",middleware.checkUserOwnership,upload.single('image'),function(req,res){
	User.findById(req.params.user_id,async function(err,foundUser){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			if (req.file) {
            	try {
					if(foundUser.imageId!="def"){
						await cloudinary.v2.uploader.destroy(foundUser.imageId);
					}
					var result = await cloudinary.v2.uploader.upload(req.file.path);
					foundUser.imageId = result.public_id;
					foundUser.image = result.secure_url;
           		} catch(err) {
					req.flash("error", err.message);
					console.log(err);
					return res.redirect("back");
          		}
  		    }
            foundUser.fullname = req.body.fullname;
            foundUser.quote = req.body.quote;
            foundUser.bio = req.body.bio;
            foundUser.phone = req.body.phone;
			var x=[req.body.fb,req.body.insta,req.body.twitter,req.body.web,req.body.li];
			foundUser.arr = x;
            foundUser.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/users/" + foundUser._id);
		}
	})	
})

module.exports=router;