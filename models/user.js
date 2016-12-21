var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    email: { type: String, index: true },
    name: String,
    gender: String,
    picture: String,
    latitude: Number,
    longitude: Number,
    country: String
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}