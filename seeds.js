var mongoose=require("mongoose"),
	Campground=require("./models/campground"),
	Comment=require("./models/comment");

var data=[
	{
		name: "Hill View",
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Welcome to the most beautiful hill of the world"
	},
	{
		name: "Hill View",
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Welcome to the most beautiful hill of the world"
	},
	{
		name: "Hill View",
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Welcome to the most beautiful hill of the world"
	}	
];

function seedDB(){
	Campground.remove({},function(err){
	// 	if(err)
	// 		console.log(err);
	// 	else
	// 		console.log("Removed campgrounds");
	// 		data.forEach(function(seed){
	// 			Campground.create(seed,function(err,campground){
	// 				if(err){
	// 					console.log(err);
	// 				}else{
	// 					console.log("Addad a campground!");
	// 					Comment.create({
	// 						text:"Yay!I loved this place!",
	// 						author:"Steve Rogers"
	// 					},function(err,comment){
	// 						if(err)
	// 							console.log(err);
	// 						else{
	// 							campground.comments.push(comment);
	// 							campground.save();
	// 							console.log("Created a comment!");
	// 						}
	// 					})
	// 				}
	// 			})
	// 		})
	});
}
module.exports=seedDB;