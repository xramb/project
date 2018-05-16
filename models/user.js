var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    passwordConf: {
        type: String,
        required: true,
    }
})

UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email: email})
    .exec(function(err, user){
        if(err){
            return callback(err)
        } else if (!user){
            var err = new Error('User not found')
            err.status = 401
            return callback(err)
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                return callback(null, user)
            } else {
                return callback()
            }
        })
    })
}

//is session on?
UserSchema.statics.chkSesId = function (ses_id) {
    
    UserSchema.findById(ses_id)
    .exec(function(error, user){
        if(error){
            return next(error)
        } else {
            if(user === null){
                var err = new Error('Not authorized. Go ' + '<a href="/">back</a>')
                err.status = 400;
                return next(err)
            } else {
                return res.send('<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
            }
        }
    })
}

//hashing a password befor saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
            return next(err)
        }
        user.password = hash;
        next();
    })
})



var User = mongoose.model('User', UserSchema)
module.exports = User;