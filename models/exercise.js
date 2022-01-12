const mongoose = require('mongoose');
//A schema defines the structure of our documents that we store inside a collection
const Schema = mongoose.Schema; 



const exerciseSchema = new Schema({
    description:{
        type:String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date:{
        type: String
    }

}, {timestamps: true})

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    // create an array of a bunch of exercises and so the log will expect an array 
    log: [exerciseSchema]
    
});



const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);


module.exports = {
    User: User,
    Exercise: Exercise
}; 
