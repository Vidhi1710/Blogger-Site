var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
	username:String,
	password:String,
	fullname:String,
	quote:{
		type:String,
		default:""
	},
	image:{
		type:String,
		default:"https://www.digitalwebreview.com/wp-content/uploads/2018/09/default-user-image.png"
	},
	imageId:{
		type:String,
		default:"def"
	},
	bio:{
		type:String,
		default:""
	},
	phone:{
		type:String,
		default:""
	},
	arr:{
		type:[],
		default:["","","","",""]
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Blog"
		}
	]
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);