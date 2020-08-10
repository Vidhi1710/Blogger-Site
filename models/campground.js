var mongoose=require("mongoose");


var campgroundSchema= new mongoose.Schema({
	name: String,
	image: String,
	description: {
		type:String,
		default:""
	},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		fullname:String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	],
	date: Date
});

module.exports = mongoose.model("Campground", campgroundSchema);