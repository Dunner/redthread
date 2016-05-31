// models/story.js

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema;

var storySchema = new Schema({
    name : String,
    slug : String,
    password : String,
    createdAt: Date,
    threadIncrement: Number
});

// methods ======================
// generating a hash
storySchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
storySchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Story', storySchema);

