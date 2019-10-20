const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String
});

module.exports = mongoose.model("Uses", userSchema);