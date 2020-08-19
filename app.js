var express=require("express"),
	app=express(),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	Blog=require("./models/blog"),
	Comment=require("./models/comment"),
	User=require("./models/user"),
	passport=require("passport"),
	methodOverride=require("method-override"),
	localStratergy=require("passport-local"),
	flash=require("connect-flash"),
	blogRoutes=require("./routes/blog"),
	commentRoutes=require("./routes/comment"),
	indexRoutes=require("./routes/index"),
	userRoutes=require("./routes/user");
	
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
var url=process.env.DATABASEURL||"mongodb://localhost:27017/blogss";
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

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
app.use("/blogs",blogRoutes);
app.use("/users",userRoutes);


const port = process.env.PORT || 3000

app.listen(port , function(req,res){
	console.log("BlogSite server has started!");
});

