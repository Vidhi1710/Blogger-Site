var express=require("express"),
	app=express(),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	seedDB=require("./seeds"),
	Campground=require("./models/campground"),
	Comment=require("./models/comment"),
	User=require("./models/user"),
	passport=require("passport"),
	methodOverride=require("method-override"),
	localStratergy=require("passport-local"),
	flash=require("connect-flash"),
	campgroundRoutes=require("./routes/campground"),
	commentRoutes=require("./routes/comment"),
	indexRoutes=require("./routes/index");
	
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
// seedDB();
app.use(flash());

app.use(require("express-session")({
	secret:"Once again Rusty wins cutest dog",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})
app.use("/",indexRoutes);
app.use("/blogs/:id/comments",commentRoutes);
app.use("/blogs",campgroundRoutes);


// Campground.create({
// 	name: "Granite Land", 
// 	image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	description: "This is a beautiful Granite hill from where you vcan enjoy the view of the full city"
// },function(err,campground){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log(campground);
// 	}
// });


app.listen(3000, function(req,res){
	console.log("BlogSite server has started!");
});

