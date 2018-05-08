
// ================ MAIN SERVER SETUP AND SETTINGS ================
// --- setting up all node js modules ---
var express = require("express");
var session = require('express-session');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
const flash = require('express-flash');

// --- basic app settings views path, static path, view engine ---
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + "/static"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(flash());

// setting up the session data
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))




// ================ ROUTES AND CONTROLLERS ================
// --- root route to render the index.ejs page ---


// --- setting up my mongoDB and mongoose ---
mongoose.connect('mongodb://localhost/QuotingDojo')
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quote: {type: String, required: true}
}, {timestamps: true})
var User = mongoose.model('User', UserSchema);


app.get('/', function(req, res) {
    res.render('index');
})


// route to get the information from the form
app.post('/addQuote', function(req, res) { 
    var user = {name: req.body.name, quote: req.body.quote};
    User.create(user, function(err, user){
        if(err){
            console.log(err);
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            return res.redirect('/');
        }
        else{
            console.log('created', user);
            res.redirect('/');
        }
    })
})



app.get('/quotes', function(req, res) {
    // need to get all quotes from the db ordered by date
    User.find({}).exec(
        function(error, all_users){
            if(error){
                res.render('quotes', error);
            }
            else{
                // console.log(all_users[1].name)
                res.render('quotes', {data: all_users});
            }
        })

})



// tell the express app to listen on port 8000, always put this at the end of your server.js file
app.listen(8000, function() {
    console.log("listening on port 8000");
})