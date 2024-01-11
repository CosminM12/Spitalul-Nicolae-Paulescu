/*userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}*/

/*const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    email: String,
    //password: String
    password : {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: "Basic",
        required: true
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField : 'email'});
module.exports = mongoose.model('User', userSchema);
*/

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        // required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);