const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date,
}, {
    versionKey: false
})
const Exercise = mongoose.model('Exercise', userSchema)

module.exports = Exercise