const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    
    age: {
        type: Number
    },

    profession: {
        type: String
    },

    image: {
       type: String
    },

    refreshToken: {
        type: String
    },

    tokenChangedAt: Date,
    passwordResetToken: String,
    passwordExpires: Date,

    googleId: String, 

}, {
    timestamps: true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMatched = async function(enterPass){
    return await bcrypt.compare(enterPass, this.password)
}

// userSchema.methods.resetPassword = async function(){
//     const resetToken = crypto.randomBytes(32).toString("hex")
//     this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
//     // this.passwordExpires = Date.now() + 30 * 60 * 1000 // 10 minut
//     return resetToken;
// }

userSchema.methods.hashingPass = async(pass) => {
    return bcrypt.hash(pass, 10)
}
//set up find or create plugin
userSchema.plugin(findOrCreate);
//set up passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', userSchema)
