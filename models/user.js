var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://user:Password1@ds127044.mlab.com:27044/authenticator-test');
var db = mongoose.connection;


//user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileImage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getuserById =function (id, callback) {
    User.findById(id, callback);
}

module.exports.getuserByUsername =function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        callback(null, isMatch);
    });    
}

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });

};
