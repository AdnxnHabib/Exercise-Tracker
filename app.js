//import the express module and create an express application 
const express = require('express');
const app = express();
const {Exercise} = require('./models/exercise');
const {User} = require('./models/exercise');

//register with view engine

app.set('view engine', 'ejs');

const mongoose = require('mongoose');
const { response, request } = require('express');
const port = 3000; 

//connect to mongodb 
const dbURI = 'mongodb+srv://adnxnhabib:spooderman16@cluster0.kbl7l.mongodb.net/Sample-Database?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(function(result) {
// only start listening for requests after the connection to the database is complete 
//starts up the server and prints a log comment to the console 
    app.listen(port, function(){
        console.log("App listening on port " + port)
    }); 
})
.catch(function (err){
    console.log(err)
})

//middleware 
app.use(express.urlencoded({ extended : true}));

//mongoose and mongo sandbox routes

/*app.get('/new-exercise', function(req, res){
    const exercise = new Exercise({
        name: 'Bicep Curl',
        description: 'lol',
        duration: '10 min' 
    });

    exercise.save()
        .then((result) =>{
            res.send(result)
        })
        .catch((err) =>{
            console.log(err)
        });
})*/

//route definition 
// get specifies a function that will be invoked when there is an http get
// request with the / path, and returns the string "hellow world"
app.get('/', function(req,res){
    res.redirect('/all-users')
});

app.get('/all-users', (req, res) => {
    User.find()
    .then((result) => {
        res.render('index', { users: result})
    })
    .catch((error) => {
        console.log(error)
    })
})

app.get('/about', function(req, res){
    res.render('about')
});

app.get('/exercise/add', function(req,res){
    res.render('add')
});

app.get('/create-user', function(req,res){
    res.render('new-user')
});


//creating a new user 
requestbody = {}
app.post('/api/users', function(req,res){
    //create a new user from the inputted username and put it in a model
    const newUser = new User({
        username: req.body.username
    });

    newUser.save()
    .then((savedData) =>{
        const responseObject = {}
        responseObject['username'] = savedData.username;
        responseObject['_id'] = savedData.id;
        res.json(responseObject);
    })
    .catch((error)=>{
        console.log(error)
    });
});

// i start using arrow functions here 
// grabs all users 
app.get('/api/exercise/users', (req, res) =>{
    User.find()
    .then((result) =>{
        res.send(result)
    })
    .catch((error) =>{
        console.log(error)
    });
});



// creating a new exercise 

app.post('/api/exercise/add', (req,res)=>{
    const newSession = new Exercise({
        description: req.body.username,
        duration: parseInt(req.body.duration),
        date: req.body.date
    }) 

    if(newSession.date === ''){
        newSession.date = new Date().toISOString.substring(0,10)
    }

    //update the user 

    User.findByIdAndUpdate(req.body.userId, {$push : {log: newSession}}, {new:true})
    .then((updatedUser) => {
        let responseObject = {}
        responseObject['_id'] = updatedUser.id
        responseObject['username'] = updatedUser.username
        responseObject['date'] = new Date(newSession.date).toDateString()
        responseObject['description'] = newSession.description
        responseObject['duration'] = newSession.duration
        res.json(responseObject)
    })
    .catch((error)=>{
        console.log(error)
    });
});


app.get('/api/exercise/log/:id', (request,response) => {
    const id = request.params.id;
    User.findById(id, (error, result) => {
        if(!error){
                result['count'] = result.log.length
          response.json(result)
        }
        else{
            console.log(error)
        }
      })
})


app.get('/api/exercise/log', (request, response) => {
    User.findById(request.query.userId, (error, result) => {
      if(!error){
              result['count'] = result.log.length
        response.json(result)
      }
      else{
          console.log(error)
      }
    })
  })

//404 page 

app.use(function(req, res){
    res.status(404).render('404');
});
